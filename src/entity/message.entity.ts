import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "@/entity/base.entity";
import { UserEntity } from "./user.entity";
import { ConversationEntity } from "./conversation.entity";

export enum MessageRoleEnum {
  HUMAN = "HUMAN",
  SYSTEM = "SYSTEM",
}

@Entity({ name: "messages" })
export class MessageEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column("text")
  role: MessageRoleEnum;

  @Column()
  content: string;

  @Column()
  conversationId: string;

  @ManyToOne(() => ConversationEntity, { nullable: true })
  @JoinColumn()
  conversation: ConversationEntity;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn()
  user: UserEntity;
}
