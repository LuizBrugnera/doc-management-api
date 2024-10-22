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
export class FolderAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foldername: string;

  @ManyToOne(() => Department, (department) => department.foldersAccess, {
    onDelete: "CASCADE",
  })
  department: Department;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
