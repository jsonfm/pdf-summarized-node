import { AppDataSource } from "@/database";
import { UserEntity } from "@/entity/user.entity";
import { Repository, FindOptionsWhere } from "typeorm";

export class UsersService {
  repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  findOneByEmail = async (email: string) => {
    return await this.repository.findOneBy({ email });
  };

  findOneBy = async (where: FindOptionsWhere<UserEntity>) => {
    return await this.repository.findOneBy(where);
  };

  save = async (data: any) => {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  };
}
