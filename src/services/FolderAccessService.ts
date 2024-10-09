import { AppDataSource } from "../data-source";
import { FolderAccess } from "../entities/FolderAccess";
import { Department } from "../entities/Department";

export class FolderAccessService {
  private folderAccessRepository = AppDataSource.getRepository(FolderAccess);
  private departmentRepository = AppDataSource.getRepository(Department);

  async getAllFolderAccesses(): Promise<FolderAccess[]> {
    return await this.folderAccessRepository.find({
      relations: ["department"],
    });
  }

  async getFolderAccessById(id: number): Promise<FolderAccess | null> {
    return await this.folderAccessRepository.findOne({
      where: { id },
      relations: ["department"],
    });
  }

  async createFolderAccess(data: Partial<FolderAccess>): Promise<FolderAccess> {
    const department = await this.departmentRepository.findOneBy({
      id: data.department?.id,
    });
    if (!department) {
      throw new Error("Departamento não encontrado");
    }
    const folderAccess = this.folderAccessRepository.create({
      ...data,
      department,
    });
    return await this.folderAccessRepository.save(folderAccess);
  }

  async updateFolderAccess(
    id: number,
    data: Partial<FolderAccess>
  ): Promise<FolderAccess | null> {
    const folderAccess = await this.folderAccessRepository.findOneBy({ id });
    if (!folderAccess) {
      return null;
    }
    this.folderAccessRepository.merge(folderAccess, data);
    return await this.folderAccessRepository.save(folderAccess);
  }

  async deleteFolderAccess(id: number): Promise<boolean> {
    const result = await this.folderAccessRepository.delete(id);
    return result.affected !== 0;
  }
}
