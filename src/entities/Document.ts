import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ default: "Não Informado" })
  description: string;

  @Column()
  date: Date;

  @Column()
  uuid: string;

  @Column()
  folder: string;

  @Column({ nullable: true })
  totalFiles: number;

  @Column({ nullable: true })
  hash: string;

  @Column({ nullable: true })
  position: number;

  @Column({ default: false })
  isInvisible: boolean;

  @ManyToOne(() => User, (user) => user.documents, {
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
