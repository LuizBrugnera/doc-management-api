import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { FolderAccess } from "./FolderAccess";
import { Log } from "./Log";
import { EmailTemplate } from "./EmailTemplate";

@Entity()
export class Department {
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

  @Column()
  department: string;

  @OneToMany(() => FolderAccess, (folderAccess) => folderAccess.department)
  foldersAccess: FolderAccess[];

  @OneToMany(() => Log, (log) => log.department)
  logs: Log[];

  @OneToMany(() => EmailTemplate, (template) => template.department)
  emailTemplates: EmailTemplate[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
