import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Document } from "./Document";
import { Notification } from "./Notification";
import { EmailUserDepartment } from "./EmailUserDepartment";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mainEmail: string;

  @Column({
    nullable: true,
  })
  cnpj: string;

  @Column({
    nullable: true,
  })
  rg: string;

  @Column({
    nullable: true,
  })
  cpf: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  cod: string;

  @Column()
  password: string;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(
    () => EmailUserDepartment,
    (emailUserDepartment) => emailUserDepartment.user
  )
  emailUserDepartments: EmailUserDepartment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
