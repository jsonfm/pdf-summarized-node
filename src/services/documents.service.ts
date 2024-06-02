import { AppDataSource } from "@/database";
import { DocumentEntity } from "@/entity/document.entity";
import { FindManyOptions, Repository } from "typeorm";

export class DocumentsService {
  repository: Repository<DocumentEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(DocumentEntity);
  }

  findAndCount = async (options?: FindManyOptions<DocumentEntity>) => {
    return await this.repository.findAndCount(options);
  };

  findOneByName = async (name: string) => {
    return this.repository.findOneBy({ name });
  };

  findOneByExternalVectorId = async (externalVectorId: string) => {
    return await this.repository.findOneBy({ externalVectorId });
  };

  findOneById = async (documentId: string) => {
    return await this.repository.findOneBy({ id: documentId });
  };

  save = async (data: any) => {
    const document = this.repository.create(data);
    return await this.repository.save(document);
  };
}
