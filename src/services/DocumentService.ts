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

  async getDocumentByName(name: string): Promise<Document | null> {
    return await this.documentRepository.findOne({
      where: { name },
      relations: ["user"],
    });
  }
  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return await this.documentRepository.find({
      where: { user: { id: userId } },
      relations: ["user"],
    });
  }

  async getDocumentsByFolder(folder: string): Promise<Document[]> {
    return await this.documentRepository.find({
      where: { folder },
      relations: ["user"],
    });
  }

  async getDocumentsWithUsernames(): Promise<any[]> {
    const documents = await this.documentRepository
      .createQueryBuilder("documents")
      .innerJoin("documents.user", "users")
      .select([
        "documents.id",
        "documents.userId",
        "documents.name",
        "users.name",
      ])
      .addSelect("users.name", "username")
      .getRawMany();

    return documents;
  }

  async getDocumentsByUserIdAndFolder(
    userId: number,
    folder: string
  ): Promise<Document[]> {
    return await this.documentRepository.find({
      where: {
        user: {
          id: userId,
        },
        folder,
        isInvisible: false,
      },
      order: { date: "DESC" },
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

  async updateDocumentUserId(
    documentId: number,
    newUserId: number
  ): Promise<void> {
    await this.documentRepository.update(
      { id: documentId },
      { user: { id: newUserId } }
    );
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await this.documentRepository.delete(id);
    return result.affected !== 0;
  }
}
