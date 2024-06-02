import { AppDataSource } from "@/database";
import { MessageEntity } from "@/entity/message.entity";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

export class MessagesService {
  repository: Repository<MessageEntity>;
  constructor() {
    this.repository = AppDataSource.getRepository(MessageEntity);
  }
  getMessagesByUser = async (userId: string, { limit = 100, offset = 0 } = { limit: 100, offset: 0 }) => {
    return await this.repository.findAndCount({
      where: { userId },
      take: limit,
      skip: offset,
    });
  };

  getMessagesByConversation = async (conversationId: string, { limit = 100, offset = 0, sortAscending = true }) => {
    return await this.repository.findAndCount({
      where: {
        conversationId,
      },
      take: limit,
      skip: offset,
      order: {
        createdAt: !!sortAscending ? "ASC" : "DESC",
      },
    });
  };

  findAndCount = async (options?: FindManyOptions<MessageEntity>) => {
    return await this.repository.findAndCount(options);
  };

  findOneBy = async (where: FindOptionsWhere<MessageEntity>) => {
    return await this.repository.findOneBy(where);
  };

  save = async (data: any) => {
    const message = this.repository.create(data);
    return await this.repository.save(message);
  };
}
