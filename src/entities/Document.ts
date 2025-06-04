import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { User } from "./User";
import { AssignedDocument } from "./AssignedDocument";

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

  @OneToOne(
    () => AssignedDocument,
    (assignedDocument) => assignedDocument.document,
    {
      onDelete: "CASCADE",
      nullable: true,
    }
  )
  assignedDocument: AssignedDocument;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
