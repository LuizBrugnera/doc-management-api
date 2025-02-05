import { AppDataSource } from "../data-source";
import { Os } from "../entities/Os";
import { ServiceData } from "../entities/ServiceData";

export class OsService {
  private osRepository = AppDataSource.getRepository(Os);
  private serviceDataRepository = AppDataSource.getRepository(ServiceData);

  async updateOsWithServices(): Promise<void> {
    const allOs = await this.osRepository.find({ relations: ["services"] });
    const allServices = await this.serviceDataRepository.find();

    // Criar um Map para acesso rápido ao tipo do serviço
    const serviceMap = new Map<string, string>(
      allServices.map((service) => [service.name, service.type])
    );

    // Filtrar e atualizar apenas as OS que têm correspondência
    const updatedOs = allOs
      .map((os) => {
        const matchedService = os.services.find((s) => serviceMap.has(s.name));
        if (matchedService) {
          os.type = serviceMap.get(matchedService.name) ?? "default_type"; // Garantir que type seja uma string
          return os;
        }
        return null; // Retorna null se não houver atualização
      })
      .filter((os): os is Os => os !== null); // Remover valores nulos e garantir tipagem correta

    if (updatedOs.length > 0) {
      await this.osRepository.save(updatedOs);
    }
  }

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
