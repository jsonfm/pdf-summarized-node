import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "@/entity/base.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Index()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;
}
