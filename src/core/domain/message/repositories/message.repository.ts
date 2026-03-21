import { Message } from "../entities/message.entity";
import { MessageStatus } from "../enums/message-status.enum";

export abstract class MessageRepository {
    abstract create(message: Message): Promise<Message>;
    abstract findById(id: string): Promise<Message | null>;
    abstract findBySender(sender: string): Promise<Message[]>;
    abstract findByPeriod(
        startDate: Date,
        endDate: Date,
    ): Promise<Message[]>;

    abstract findBySenderAndPeriod(
        sender: string,
        startDate: Date,
        endDate: Date,
    ): Promise<Message[]>;

    abstract updateStatus(id: string, status: MessageStatus): Promise<Message>;
}


