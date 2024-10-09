import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Admin } from "./Admin";

@Entity()
export class AdminLog {
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

  @ManyToOne(() => Admin, (admin) => admin.adminLogs)
  admin: Admin;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
