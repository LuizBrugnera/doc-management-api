import { AppDataSource } from "../data-source";
import { Log } from "../entities/Log";
import { Department } from "../entities/Department";

export class LogService {
  private logRepository = AppDataSource.getRepository(Log);
  private departmentRepository = AppDataSource.getRepository(Department);

  async getAllLogs(): Promise<Log[]> {
    return await this.logRepository.find({ relations: ["department"] });
  }

  async getLogById(id: number): Promise<Log | null> {
    return await this.logRepository.findOne({
      where: { id },
      relations: ["department"],
    });
  }

  async createLog(data: Partial<Log>): Promise<Log> {
    const department = await this.departmentRepository.findOneBy({
      id: data.department?.id,
    });
    if (!department) {
      throw new Error("Departamento não encontrado");
    }
    const log = this.logRepository.create({ ...data, department });
    return await this.logRepository.save(log);
  }

  async updateLog(id: number, data: Partial<Log>): Promise<Log | null> {
    const log = await this.logRepository.findOneBy({ id });
    if (!log) {
      return null;
    }
    this.logRepository.merge(log, data);
    return await this.logRepository.save(log);
  }

  async deleteLog(id: number): Promise<boolean> {
    const result = await this.logRepository.delete(id);
    return result.affected !== 0;
  }
}
