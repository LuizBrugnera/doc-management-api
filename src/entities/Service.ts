import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Os } from "./Os";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cod: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  quantity: string;

  @Column({
    nullable: true,
  })
  totalValue: string;

  @ManyToOne(() => Os, (os) => os.services, {
    onDelete: "CASCADE",
  })
  os: Os;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
