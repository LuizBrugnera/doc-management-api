import { AppDataSource } from "../data-source";
import { Os } from "../entities/Os";

export class OsService {
  private osRepository = AppDataSource.getRepository(Os);

  async getAllOss(): Promise<Os[]> {
    return await this.osRepository.find({ relations: ["services"] });
  }

  async getOsById(id: number): Promise<Os | null> {
    return await this.osRepository.findOne({
      where: { id },
      relations: ["services"],
    });
  }

  async createOs(osData: Partial<Os>): Promise<Os> {
    const os = this.osRepository.create(osData);
    return await this.osRepository.save(os);
  }
  async getOsByKey(key: string, value: string): Promise<Os | null> {
    return await this.osRepository.findOne({
      where: { [key]: value },
    });
  }

  async updateOs(id: number, osData: Partial<Os>): Promise<Os | null> {
    const os = await this.osRepository.findOneBy({ id });
    if (!os) {
      return null;
    }
    this.osRepository.merge(os, osData);
    return await this.osRepository.save(os);
  }

  async deleteOs(id: number): Promise<boolean> {
    const result = await this.osRepository.delete(id);
    return result.affected !== 0;
  }
}
