import {
    CreateTableCommand,
    DescribeTableCommand,
    DynamoDBClient,
    waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Message } from '../../../../core/domain/message/entities/message.entity';
import { MessageStatus } from '../../../../core/domain/message/enums/message-status.enum';
import { MessageRepository } from '../../../../core/domain/message/repositories/message.repository';


export class DynamoDbMessageRepository extends MessageRepository {
    private readonly client: DynamoDBDocumentClient;
    private readonly rawClient: DynamoDBClient;
    private readonly tableName = process.env.DYNAMODB_TABLE_NAME || 'messages';
    private tableReady?: Promise<void>;

    constructor() {
        super();
        const dynamoClient = new DynamoDBClient({
            region: process.env.AWS_REGION || 'us-east-1',
        });
        this.rawClient = dynamoClient;
        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }

    public async create(message: Message): Promise<Message> {
        await this.ensureTableExists();
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: this.toItem(message),
            }),
        );
        return message;
    }

    public async findById(id: string): Promise<Message | null> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: {
                    pk: `MESSAGE#${id}`,
                    sk: 'METADATA',
                },
            }),
        );

        if (!result.Item) return null;
        return this.toEntity(result.Item);
    }

    public async findBySender(sender: string): Promise<Message[]> {
        const result = await this.client.send(
            new QueryCommand({
                TableName: this.tableName,
                IndexName: 'gsi1',
                KeyConditionExpression: 'gsi1pk = :sender',
                ExpressionAttributeValues: {
                    ':sender': `SENDER#${sender}`,
                },
            }),
        );

        return (result.Items || []).map((item) => this.toEntity(item));
    }

    public async findByPeriod(startDate: Date, endDate: Date): Promise<Message[]> {
        const result = await this.client.send(
            new QueryCommand({
                TableName: this.tableName,
                IndexName: 'gsi2', // Usando o outro Índice Secundário para buscar por Data
                KeyConditionExpression:
                    'gsi2pk = :message AND gsi2sk BETWEEN :startDate AND :endDate',
                ExpressionAttributeValues: {
                    ':message': 'MESSAGE',
                    ':startDate': startDate.toISOString(),
                    ':endDate': endDate.toISOString(),
                },
            }),
        );

        return (result.Items || []).map((item) => this.toEntity(item));
    }

    public async findBySenderAndPeriod(
        sender: string,
        startDate: Date,
        endDate: Date,
    ): Promise<Message[]> {
        const result = await this.client.send(
            new QueryCommand({
                TableName: this.tableName,
                IndexName: 'gsi1',
                KeyConditionExpression:
                    'gsi1pk = :sender AND gsi1sk BETWEEN :startDate AND :endDate',
                ExpressionAttributeValues: {
                    ':sender': `SENDER#${sender}`,
                    ':startDate': startDate.toISOString(),
                    ':endDate': endDate.toISOString(),
                },
            }),
        );

        return (result.Items || []).map((item) => this.toEntity(item));
    }

    public async updateStatus(id: string, status: MessageStatus): Promise<Message> {
        const result = await this.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: {
                    pk: `MESSAGE#${id}`,
                    sk: 'METADATA',
                },
                UpdateExpression: 'SET #status = :status',
                ExpressionAttributeNames: {
                    '#status': 'status', // Evita conflitos com palavras reservadas do DynamoDB
                },
                ExpressionAttributeValues: {
                    ':status': status,
                },
                ReturnValues: 'ALL_NEW', // Retorna o item completo após a atualização
            }),
        );

        if (!result.Attributes) {
            throw new Error('Failed to update message status');
        }

        return this.toEntity(result.Attributes);
    }

    private toItem(message: Message) {
        return {
            pk: `MESSAGE#${message.id}`,                 // Graças aos 'getters', podemos ler message.id tranquilamente!
            sk: 'METADATA',
            gsi1pk: `SENDER#${message.sender}`,
            gsi1sk: message.sentAt.toISOString(),
            gsi2pk: 'MESSAGE',
            gsi2sk: message.sentAt.toISOString(),
            id: message.id,
            content: message.content,
            sender: message.sender,
            sentAt: message.sentAt.toISOString(),
            status: message.status,
        };
    }


    private toEntity(item: Record<string, any>): Message {
        return Message.restore(
            item.id,
            item.content,
            item.sender,
            new Date(item.sentAt),
            item.status as MessageStatus,
        );
    }

    private async ensureTableExists(): Promise<void> {
        if (this.tableReady) {
            return this.tableReady;
        }

        this.tableReady = (async () => {
            try {
                await this.rawClient.send(
                    new DescribeTableCommand({ TableName: this.tableName }),
                );
                return;
            } catch (err: any) {
                const name = err?.name || err?.Code;
                if (name !== 'ResourceNotFoundException') {
                    throw err;
                }
            }

            await this.rawClient.send(
                new CreateTableCommand({
                    TableName: this.tableName,
                    AttributeDefinitions: [
                        { AttributeName: 'pk', AttributeType: 'S' },
                        { AttributeName: 'sk', AttributeType: 'S' },
                        { AttributeName: 'gsi1pk', AttributeType: 'S' },
                        { AttributeName: 'gsi1sk', AttributeType: 'S' },
                        { AttributeName: 'gsi2pk', AttributeType: 'S' },
                        { AttributeName: 'gsi2sk', AttributeType: 'S' },
                    ],
                    KeySchema: [
                        { AttributeName: 'pk', KeyType: 'HASH' },
                        { AttributeName: 'sk', KeyType: 'RANGE' },
                    ],
                    BillingMode: 'PAY_PER_REQUEST',
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: 'gsi1',
                            KeySchema: [
                                { AttributeName: 'gsi1pk', KeyType: 'HASH' },
                                { AttributeName: 'gsi1sk', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                        {
                            IndexName: 'gsi2',
                            KeySchema: [
                                { AttributeName: 'gsi2pk', KeyType: 'HASH' },
                                { AttributeName: 'gsi2sk', KeyType: 'RANGE' },
                            ],
                            Projection: { ProjectionType: 'ALL' },
                        },
                    ],
                }),
            );

            await waitUntilTableExists(
                { client: this.rawClient, maxWaitTime: 60 },
                { TableName: this.tableName },
            );
        })();

        return this.tableReady;
    }
}
