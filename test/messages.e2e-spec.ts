import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { MessageStatus } from '../src/core/domain/message/enums/message-status.enum';
import { MessageRepository } from '../src/core/domain/message/repositories/message.repository';
import { InMemoryMessageRepository } from '../src/infrastructure/persistence/in-memory/repositories/in-memory-message.repository';

process.env.AUTH_EMAIL = 'e2e-user@email.com';
process.env.AUTH_PASSWORD = 'e2e-password';
process.env.JWT_SECRET = 'supersecret';

const { AppModule } = require('../src/app.module');

describe('Messages API (e2e)', () => {
    let app: INestApplication;
    const sender = 'rafael';

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(MessageRepository)
            .useValue(new InMemoryMessageRepository())
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        app.useGlobalFilters(new GlobalExceptionFilter());
        app.useGlobalInterceptors(new LoggingInterceptor());

        await app.init();
    });

    afterEach(async () => {
        if (app) {
            await app.close();
        }
    });

    async function login(): Promise<string> {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: process.env.AUTH_EMAIL,
                password: process.env.AUTH_PASSWORD,
            })
            .expect(201);

        expect(response.body.accessToken).toEqual(expect.any(String));

        return response.body.accessToken;
    }

    it('authenticates, creates a message and fetches it by id', async () => {
        const token = await login();

        const createResponse = await request(app.getHttpServer())
            .post('/messages')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'Mensagem e2e',
                sender,
            })
            .expect(201);

        expect(createResponse.body).toMatchObject({
            id: expect.any(String),
            content: 'Mensagem e2e',
            sender,
            status: MessageStatus.SENT,
        });
        expect(createResponse.body.sentAt).toEqual(expect.any(String));

        const getResponse = await request(app.getHttpServer())
            .get(`/messages/${createResponse.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(getResponse.body).toEqual(createResponse.body);
    });

    it('updates the status and searches messages by sender and period', async () => {
        const token = await login();

        const createResponse = await request(app.getHttpServer())
            .post('/messages')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'Fluxo completo',
                sender,
            })
            .expect(201);

        const sentAt = new Date(createResponse.body.sentAt).getTime();
        const startDate = new Date(sentAt - 60_000).toISOString();
        const endDate = new Date(sentAt + 60_000).toISOString();

        const updateResponse = await request(app.getHttpServer())
            .patch(`/messages/${createResponse.body.id}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: MessageStatus.RECEIVED,
            })
            .expect(200);

        expect(updateResponse.body.status).toBe(MessageStatus.RECEIVED);

        const senderSearchResponse = await request(app.getHttpServer())
            .get('/messages')
            .query({ sender })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(senderSearchResponse.body).toHaveLength(1);
        expect(senderSearchResponse.body[0]).toMatchObject({
            id: createResponse.body.id,
            status: MessageStatus.RECEIVED,
        });

        const periodSearchResponse = await request(app.getHttpServer())
            .get('/messages')
            .query({ startDate, endDate })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(periodSearchResponse.body).toHaveLength(1);
        expect(periodSearchResponse.body[0].id).toBe(createResponse.body.id);

        const combinedSearchResponse = await request(app.getHttpServer())
            .get('/messages')
            .query({
                sender,
                startDate,
                endDate,
            })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(combinedSearchResponse.body).toHaveLength(1);
        expect(combinedSearchResponse.body[0]).toMatchObject({
            id: createResponse.body.id,
            sender,
            status: MessageStatus.RECEIVED,
        });
    });
});
