import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { MessageStatus } from '../src/core/domain/message/enums/message-status.enum';
import { MessageRepository } from '../src/core/domain/message/repositories/message.repository';
import { InMemoryMessageRepository } from '../src/infrastructure/persistence/in-memory/repositories/in-memory-message.repository';

// Configurações de ambiente para o teste
process.env.AUTH_EMAIL = 'e2e-user@email.com';
process.env.AUTH_PASSWORD = 'e2e-password';
process.env.JWT_SECRET = 'supersecret';

const { AppModule } = require('../src/app.module');

describe('Messages API (e2e)', () => {
    let app: INestApplication;
    let repository: MessageRepository;
    const sender = 'rafael';

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            /**
             * IMPORTANTE: 'new InMemoryMessageRepository()' garante que
             * o array de mensagens comece VAZIO em cada teste ('it').
             */
            .overrideProvider(MessageRepository)
            .useValue(new InMemoryMessageRepository())
            .compile();

        app = moduleFixture.createNestApplication();

        // Mantemos os Pipes e Interceptors iguais ao ambiente de produção
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.useGlobalFilters(app.get(GlobalExceptionFilter));
        app.useGlobalInterceptors(app.get(LoggingInterceptor));

        await app.init();
        repository = moduleFixture.get<MessageRepository>(MessageRepository);
    });

    afterEach(async () => {
        if (repository instanceof InMemoryMessageRepository) {
            (repository as any).messages = []; // Limpa o array de mensagens na marreta
        }
        await app.close();
    });
    /**
     * Helper para autenticar e obter o Token JWT
     */
    async function login(): Promise<string> {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: process.env.AUTH_EMAIL,
                password: process.env.AUTH_PASSWORD
            })
            .expect(201);
        return response.body.accessToken;
    }

    it('authenticates, creates a message and fetches it by id', async () => {
        const token = await login();

        // 1. Criar Mensagem
        const createResponse = await request(app.getHttpServer())
            .post('/messages')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Mensagem e2e', sender })
            .expect(201);

        const createdMsg = createResponse.body;
        const msgId = createdMsg.id;

        expect(createdMsg).toMatchObject({
            sender,
            status: MessageStatus.SENT,
        });

        // 2. Buscar por ID
        const getResponse = await request(app.getHttpServer())
            .get(`/messages/${msgId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(getResponse.body).toEqual(createdMsg);
    });

    it('updates the status and searches messages by sender and period', async () => {
        const token = await login();

        // 1. Criar a mensagem (Ela nasce como SENT)
        const createResponse = await request(app.getHttpServer())
            .post('/messages')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Fluxo completo', sender })
            .expect(201);

        const createdMsg = createResponse.body;
        const msgId = createdMsg.id;
        const sentAtStr = createdMsg.sentAt;

        // 2. Atualizar Status para RECEIVED
        // Transição permitida na Entity: SENT -> RECEIVED
        const updateResponse = await request(app.getHttpServer())
            .patch(`/messages/${msgId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: MessageStatus.RECEIVED })
            .expect(200);

        const currentStatus = updateResponse.body.status;
        expect(currentStatus).toBe(MessageStatus.RECEIVED);

        // 3. Preparar datas para a busca (60 segundos de margem)
        const sentAt = new Date(sentAtStr).getTime();
        const startDate = new Date(sentAt - 60000).toISOString();
        const endDate = new Date(sentAt + 60000).toISOString();

        // 4. Busca por remetente
        const senderSearch = await request(app.getHttpServer())
            .get('/messages')
            .query({ sender })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(senderSearch.body).toHaveLength(1);

        // 5. Busca combinada (Remetente + Período)
        const combinedSearch = await request(app.getHttpServer())
            .get('/messages')
            .query({ sender, startDate, endDate })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const foundId = combinedSearch.body[0].id;
        expect(foundId).toBe(msgId);

        const foundStatus = combinedSearch.body[0].status;
        expect(foundStatus).toBe(MessageStatus.RECEIVED);
    });
});
