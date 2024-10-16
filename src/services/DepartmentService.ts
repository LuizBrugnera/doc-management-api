import { AppDataSource } from "../data-source";
import { Department } from "../entities/Department";

export class DepartmentService {
  private departmentRepository = AppDataSource.getRepository(Department);

  async getAllDepartments(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: ["foldersAccess", "logs"],
    });
  }

  async getDepartmentByEmail(email: string): Promise<Department | null> {
    return await this.departmentRepository.findOne({
      where: { email },
    });
  }

  async getDepartmentById(id: number): Promise<Department | null> {
    return await this.departmentRepository.findOne({
      where: { id },
      relations: ["foldersAccess", "logs"],
    });
  }

  async createDepartment(
    departmentData: Partial<Department>
  ): Promise<Department> {
    const department = this.departmentRepository.create(departmentData);
    return await this.departmentRepository.save(department);
  }

  async updateDepartment(
    id: number,
    departmentData: Partial<Department>
  ): Promise<Department | null> {
    const department = await this.departmentRepository.findOneBy({ id });
    if (!department) {
      return null;
    }
    this.departmentRepository.merge(department, departmentData);
    return await this.departmentRepository.save(department);
  }

  async deleteDepartment(id: number): Promise<boolean> {
    const result = await this.departmentRepository.delete(id);
    return result.affected !== 0;
  }
}
