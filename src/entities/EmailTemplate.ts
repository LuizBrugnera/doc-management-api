import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Department } from "./Department";
import { Admin } from "./Admin";

@Entity()
export class EmailTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  subject: string;

  @Column("text")
  content: string;

  @Column({ nullable: true })
  type: string;

  @ManyToOne(() => Department, { nullable: true, onDelete: "CASCADE" })
  department: Department;

  @ManyToOne(() => Admin, { nullable: true, onDelete: "CASCADE" })
  admin: Admin;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
