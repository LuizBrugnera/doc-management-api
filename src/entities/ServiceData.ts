import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ServiceData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cod: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  sellValue: string;

  @Column("text", {
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  duration: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
