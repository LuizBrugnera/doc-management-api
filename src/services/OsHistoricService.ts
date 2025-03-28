import { AppDataSource } from "../data-source";
import { Os } from "../entities/Os";
import { OsHistoric } from "../entities/OsHistoric";

export class OsHistoricService {
  private osHistoricRepository = AppDataSource.getRepository(OsHistoric);
  private osRepository = AppDataSource.getRepository(Os);

  async getAllOsHistoric(): Promise<OsHistoric[]> {
    return await this.osHistoricRepository.find();
  }

  async getOsHistoricById(id: number): Promise<OsHistoric | null> {
    return await this.osHistoricRepository.findOne({
      where: { id },
    });
  }

  async getAllOsHistoricByOsId(id: number): Promise<OsHistoric[]> {
    return await this.osHistoricRepository.find({
      where: { os: { id } },
    });
  }

  async createOsHistoric(data: Partial<OsHistoric>): Promise<OsHistoric> {
    const os = await this.osRepository.preload({
      id: data.os?.id,
    });
    if (!os) {
      throw new Error("Os não encontrado");
    }

    const osHistoric = this.osHistoricRepository.create({ ...data, os });

    return await this.osHistoricRepository.save(osHistoric);
  }
}
