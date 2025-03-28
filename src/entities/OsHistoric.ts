import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Os } from "./Os";

@Entity()
export class OsHistoric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  lastUpdate: string;

  @ManyToOne(() => Os, (os) => os.osHistoric, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "os_id" })
  os: Os;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
