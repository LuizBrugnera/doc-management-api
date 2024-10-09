import { AppDataSource } from "../data-source";
import { AdminLog } from "../entities/AdminLog";
import { Admin } from "../entities/Admin";

export class AdminLogService {
  private adminLogRepository = AppDataSource.getRepository(AdminLog);
  private adminRepository = AppDataSource.getRepository(Admin);

  async getAllAdminLogs(): Promise<AdminLog[]> {
    return await this.adminLogRepository.find({ relations: ["admin"] });
  }

  async getAdminLogById(id: number): Promise<AdminLog | null> {
    return await this.adminLogRepository.findOne({
      where: { id },
      relations: ["admin"],
    });
  }

  async createAdminLog(data: Partial<AdminLog>): Promise<AdminLog> {
    const admin = await this.adminRepository.findOneBy({ id: data.admin?.id });
    if (!admin) {
      throw new Error("Administrador não encontrado");
    }
    const adminLog = this.adminLogRepository.create({ ...data, admin });
    return await this.adminLogRepository.save(adminLog);
  }

  async updateAdminLog(
    id: number,
    data: Partial<AdminLog>
  ): Promise<AdminLog | null> {
    const adminLog = await this.adminLogRepository.findOneBy({ id });
    if (!adminLog) {
      return null;
    }
    this.adminLogRepository.merge(adminLog, data);
    return await this.adminLogRepository.save(adminLog);
  }

  async deleteAdminLog(id: number): Promise<boolean> {
    const result = await this.adminLogRepository.delete(id);
    return result.affected !== 0;
  }
}
