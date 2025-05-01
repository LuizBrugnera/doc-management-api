import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Question } from "./Question";

@Entity()
export class SubQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  questionId: string;

  @ManyToOne(() => Question, (question) => question.subQuestions, {
    onDelete: "CASCADE",
  })
  question: Question;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
