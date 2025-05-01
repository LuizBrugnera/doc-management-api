import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { SubQuestion } from "./SubQuestion";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionId: number;

  @Column()
  title: string;

  @Column()
  riskTitle: string;

  @Column("text")
  mainQuestion: string;

  @Column()
  severity: number;

  @Column("text")
  agente: string;

  @Column("text")
  definicaoDoPerigo: string;

  @Column("text")
  possiveisLesoes: string;

  @Column("text")
  circunstancias: string;

  @Column("text")
  severidadeDescricao: string;

  @Column("text")
  planoAcao: string;

  @OneToMany(() => SubQuestion, (subQuestion) => subQuestion.question)
  subQuestions: SubQuestion[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
