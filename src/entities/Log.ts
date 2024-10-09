import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Department } from "./Department";

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  action: string;

  @Column()
  state: string;

  @Column()
  date: Date;

  @ManyToOne(() => Department, (department) => department.logs)
  department: Department;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
