import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Os } from "./Os";
import { Document } from "./Document";

@Entity()
export class AssignedDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cod: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  cnpj: string;

  @Column()
  pgr: string;

  @Column()
  pcmso: string;

  @Column()
  ltcat: string;

  @Column()
  diversos: string;

  @Column()
  treinamentos: string;

  @Column()
  atribuicao: string;

  @Column()
  status: string;

  @Column()
  historico: string;

  @ManyToOne(() => Os, (os) => os.assignedDocument, {
    nullable: true, // se for opcional
    onDelete: "SET NULL", // ou "CASCADE" se quiser apagar AssignedDocuments junto
  })
  @JoinColumn({ name: "os_id" })
  os?: Os;

  @OneToOne(() => Document, (document) => document.assignedDocument, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "document_id" })
  document: Document;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
