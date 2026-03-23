import { randomUUID } from 'crypto';
import { LoggerPort } from '../../ports/logger.port';
import { UserRepository } from 'src/core/domain/user/repository/user.repository';
import { User } from 'src/core/domain/user/entities/user.entity';
import { UserAlreadyExistsError } from '../../errors/user-already-exists.error';


interface RegisterUserInput {
    name: string;
    email: string;
    passwordHash: string;
}

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly logger: LoggerPort,
    ) { }

    async execute(input: RegisterUserInput): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(input.email);

        if (existingUser) {
            this.logger.warn('User registration rejected because email already exists', {
                source: 'RegisterUserUseCase',
                email: input.email,
            });

            throw new UserAlreadyExistsError(input.email);
        }

        const user = new User(
            randomUUID(),
            input.name,
            input.email,
            input.passwordHash,
            new Date(),
        );

        const createdUser = await this.userRepository.create(user);

        this.logger.log('User registered successfully', {
            source: 'RegisterUserUseCase',
            userId: createdUser.id,
            email: createdUser.email,
        });

        return createdUser;
    }
}