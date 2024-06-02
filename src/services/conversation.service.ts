import { AppDataSource } from "@/database";
import { ConversationEntity } from "@/entity/conversation.entity";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

export class ConversationsService {
  repository: Repository<ConversationEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConversationEntity);
  }

  getRepository = () => {
    return this.repository;
  };

  findAndCount = async (options?: FindManyOptions<ConversationEntity> | undefined) => {
    return await this.repository.findAndCount(options);
  };

  findOneBy = async (where: FindOptionsWhere<ConversationEntity>) => {
    return await this.repository.findOneBy(where);
  };

  save = async (data: any) => {
    const conversation = this.repository.create(data);
    return this.repository.save(conversation);
  };

  deleteOne = async (conversationId: string) => {
    return await this.repository.delete(conversationId);
  };

  softDeleteOne = async (conversationId: string) => {
    await this.repository.update(conversationId, { isDeleted: true });
    return conversationId;
  };
}
