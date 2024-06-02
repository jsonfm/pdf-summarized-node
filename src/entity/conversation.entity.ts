import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "@/entity/base.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "conversations" })
export class ConversationEntity extends BaseEntity {
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
