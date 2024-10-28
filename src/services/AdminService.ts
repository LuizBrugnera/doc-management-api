import { AppDataSource } from "../data-source";
import { Admin } from "../entities/Admin";

export class AdminService {
  private adminRepository = AppDataSource.getRepository(Admin);

  async getAllAdmins(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async getAdminById(id: number): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        created_at: true,
        updated_at: true,
        adminLogs: false,
        password: false,
      },
    });
  }

  async getAdminByIdWithPassword(id: number): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { id },
      relations: ["adminLogs"],
    });
  }

  async getAdminByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { email: email },
    });
  }

  async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
    const admin = this.adminRepository.create(adminData);
    return await this.adminRepository.save(admin);
  }

  async updateAdmin(
    id: number,
    adminData: Partial<Admin>
  ): Promise<Admin | null> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      return null;
    }
    this.adminRepository.merge(admin, adminData);
    return await this.adminRepository.save(admin);
  }

  async updatePasswordById(
    id: number,
    password: string
  ): Promise<Admin | null> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      return null;
    }
    admin.password = password;
    return await this.adminRepository.save(admin);
  }

  async deleteAdmin(id: number): Promise<boolean> {
    const result = await this.adminRepository.delete(id);
    return result.affected !== 0;
  }
}
