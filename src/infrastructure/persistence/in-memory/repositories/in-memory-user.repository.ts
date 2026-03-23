import { UserRepository } from 'src/core/domain/user/repository/user.repository';
import { User } from '../../../../core/domain/user/entities/user.entity';

export class InMemoryUserRepository extends UserRepository {
    private readonly users: User[] = [];

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find((user) => user.email === email) ?? null;
    }
}