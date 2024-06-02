import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "@/config";
import { UserEntity } from "@/entity/user.entity";
import { DocumentEntity } from "@/entity/document.entity";
import { ConversationEntity } from "@/entity/conversation.entity";
import { MessageEntity } from "@/entity/message.entity";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = Config;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: NODE_ENV === "dev" ? true : false,
  logging: NODE_ENV === "dev" ? false : false,
  entities: [UserEntity, DocumentEntity, ConversationEntity, MessageEntity],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});
