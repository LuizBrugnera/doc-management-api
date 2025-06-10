import { AppDataSource } from "../data-source";
import { AssignedDocument } from "../entities/AssignedDocument";
import { Os } from "../entities/Os";

export class AssignedDocumentService {
  private assignedDocumentRepository =
    AppDataSource.getRepository(AssignedDocument);
  private osRepository = AppDataSource.getRepository(Os);

  async getAllAssignedDocuments(): Promise<AssignedDocument[]> {
    return await this.assignedDocumentRepository.find({
      relations: ["document", "os"],
      order: {
        created_at: "DESC",
      },
    });
  }

  async getAssignedDocumentById(id: number): Promise<AssignedDocument | null> {
    return await this.assignedDocumentRepository.findOne({
      where: { id },
    });
  }

  async createAssignedDocument(
    data: Partial<AssignedDocument>
  ): Promise<AssignedDocument> {
    const assignedDocument = this.assignedDocumentRepository.create({
      ...data,
    });
    return await this.assignedDocumentRepository.save(assignedDocument);
  }

  async updateAssignedDocument(
    id: number,
    data: Partial<AssignedDocument>
  ): Promise<AssignedDocument | null> {
    const assignedDocument = await this.assignedDocumentRepository.findOne({
      where: { id },
      relations: ["os"],
    });

    if (!assignedDocument) {
      return null;
    }

    if (data.status === "assinado") {
      const os = await this.osRepository.findOneBy({
        id: assignedDocument.os?.id,
      });

      const allAssignedByOs = await this.assignedDocumentRepository.find({
        where: { os: { id: os?.id } },
      });

      if (allAssignedByOs.every((doc) => doc.status === "assinado")) {
        if (os) {
          os.status = "assinado";
          await this.osRepository.save(os);
        }
      }
    }

    this.assignedDocumentRepository.merge(assignedDocument, data);
    return await this.assignedDocumentRepository.save(assignedDocument);
  }

  async deleteAssignedDocument(id: number): Promise<boolean> {
    const result = await this.assignedDocumentRepository.delete(id);
    return result.affected !== 0;
  }
}
