import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { AdminLog } from "./AdminLog";
import { EmailTemplate } from "./EmailTemplate";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  phone: string;


  @Column()
  password: string;

  @OneToMany(() => AdminLog, (adminLog) => adminLog.admin)
  adminLogs: AdminLog[];

  @OneToMany(() => EmailTemplate, (template) => template.admin)
  emailTemplates: EmailTemplate[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
