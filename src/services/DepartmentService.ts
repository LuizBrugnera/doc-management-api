import { AppDataSource } from "../data-source";
import { Department } from "../entities/Department";

export class DepartmentService {
  private departmentRepository = AppDataSource.getRepository(Department);

  async getAllDepartments(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: ["foldersAccess", "logs"],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: false,
        department: true,
        created_at: true,
        updated_at: true,
        foldersAccess: true,
        logs: true,
        emailTemplate: true,
      },
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
      relations: ["logs"],
    });
  }

  async getDepartmentByDepartment(department: string): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: { department },
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

  async updatePasswordById(
    id: number,
    password: string
  ): Promise<Department | null> {
    const department = await this.departmentRepository.findOneBy({ id });
    if (!department) {
      return null;
    }
    department.password = password;
    return await this.departmentRepository.save(department);
  }

  async deleteDepartment(id: number): Promise<boolean> {
    const result = await this.departmentRepository.delete(id);
    return result.affected !== 0;
  }
}
