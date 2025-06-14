import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Service } from "./Service";
import { OsHistoric } from "./OsHistoric";
import { AssignedDocument } from "./AssignedDocument";

@Entity()
export class Os {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cod: string;

  @Column({ default: "pending" })
  status: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  lastUpdate: string;

  @Column({
    nullable: true,
  })
  scheduledDate: Date;

  @Column({
    nullable: true,
  })
  local: string;

  @Column({
    nullable: true,
  })
  documentId: string;

  @Column({
    nullable: true,
  })
  hash: string;

  @Column({
    nullable: true,
  })
  clientName: string;

  @Column({
    nullable: true,
  })
  clientId: string;

  @Column({
    nullable: true,
  })
  sellerId: string;

  @Column({
    nullable: true,
  })
  sellerName: string;

  @Column({
    nullable: true,
  })
  technicalId: string;

  @Column({
    nullable: true,
  })
  technicalName: string;

  @Column({
    nullable: true,
  })
  entryDate: Date;

  @Column({
    nullable: true,
  })
  exitDate: Date;

  @Column({
    nullable: true,
  })
  situationName: string;

  @Column({
    nullable: true,
  })
  totalValue: string;

  @Column({
    nullable: true,
  })
  storeName: string;

  @Column({ default: "page" })
  type: string;

  @Column()
  atribuicao: string;

  @Column({ default: "" })
  documentosOs: string;

  @OneToMany(() => Service, (service) => service.os)
  services: Service[];

  @OneToMany(() => AssignedDocument, (assignedDocument) => assignedDocument.os)
  assignedDocument: AssignedDocument[];

  @OneToMany(() => OsHistoric, (osHistoric) => osHistoric.os)
  osHistoric: OsHistoric[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
