import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
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
    private readonly tableName = process.env.DYNAMODB_TABLE_NAME || 'messages';

    constructor() {
        super();

        const dynamoClient = new DynamoDBClient({
            region: process.env.AWS_REGION || 'us-east-1',
        });

        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }

    async create(message: Message): Promise<Message> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName,
                Item: this.toItem(message),
            }),
        );

        return message;
    }

    async findById(id: string): Promise<Message | null> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: {
                    pk: `MESSAGE#${id}`,
                    sk: 'METADATA',
                },
            }),
        );

        if (!result.Item) {
            return null;
        }

        return this.toEntity(result.Item);
    }

    async findBySender(sender: string): Promise<Message[]> {
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

    async findByPeriod(startDate: Date, endDate: Date): Promise<Message[]> {
        const result = await this.client.send(
            new QueryCommand({
                TableName: this.tableName,
                IndexName: 'gsi2',
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

    async findBySenderAndPeriod(
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

    async updateStatus(id: string, status: MessageStatus): Promise<Message> {
        const result = await this.client.send(
            new UpdateCommand({
                TableName: this.tableName,
                Key: {
                    pk: `MESSAGE#${id}`,
                    sk: 'METADATA',
                },
                UpdateExpression: 'SET #status = :status',
                ExpressionAttributeNames: {
                    '#status': 'status',
                },
                ExpressionAttributeValues: {
                    ':status': status,
                },
                ReturnValues: 'ALL_NEW',
            }),
        );

        if (!result.Attributes) {
            throw new Error('Failed to update message status');
        }

        return this.toEntity(result.Attributes);
    }

    private toItem(message: Message) {
        return {
            pk: `MESSAGE#${message.id}`,
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
        return new Message(
            item.id,
            item.content,
            item.sender,
            new Date(item.sentAt),
            item.status as MessageStatus,
        );
    }
}
