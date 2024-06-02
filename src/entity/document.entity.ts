import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "@/entity/base.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "documents" })
export class DocumentEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  type: string;

  @Column()
  externalVectorId: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  user: UserEntity;
}
