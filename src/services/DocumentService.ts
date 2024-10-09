import { AppDataSource } from "../data-source";
import { Document } from "../entities/Document";
import { User } from "../entities/User";

export class DocumentService {
  private documentRepository = AppDataSource.getRepository(Document);
  private userRepository = AppDataSource.getRepository(User);

  async getAllDocuments(): Promise<Document[]> {
    return await this.documentRepository.find({ relations: ["user"] });
  }

  async getDocumentById(id: number): Promise<Document | null> {
    return await this.documentRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async createDocument(documentData: Partial<Document>): Promise<Document> {
    const user = await this.userRepository.findOneBy({
      id: documentData.user?.id,
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const document = this.documentRepository.create({ ...documentData, user });
    return await this.documentRepository.save(document);
  }

  async updateDocument(
    id: number,
    documentData: Partial<Document>
  ): Promise<Document | null> {
    const document = await this.documentRepository.findOneBy({ id });
    if (!document) {
      return null;
    }
    this.documentRepository.merge(document, documentData);
    return await this.documentRepository.save(document);
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await this.documentRepository.delete(id);
    return result.affected !== 0;
  }
}
