import { LoggerPort } from '../../ports/logger.port';
import { User } from '../../../domain/user/entities/user.entity';
import { UserRepository } from 'src/core/domain/user/repository/user.repository';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error';

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly logger: LoggerPort,
    ) { }

    async execute(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            this.logger.warn('Login failed because user was not found', {
                source: 'LoginUserUseCase',
                email,
            });

            throw new InvalidCredentialsError();
        }

        return user;
    }
}