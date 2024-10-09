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
export class EmailUserDepartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  department: string;

  @ManyToOne(() => User, (user) => user.emailUserDepartments)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
