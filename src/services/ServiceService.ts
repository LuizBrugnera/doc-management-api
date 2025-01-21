import { AppDataSource } from "../data-source";
import { Service } from "../entities/Service";

export class ServiceService {
  private serviceRepository = AppDataSource.getRepository(Service);

  async getAllServices(): Promise<Service[]> {
    return await this.serviceRepository.find();
  }

  async getServiceById(id: number): Promise<Service | null> {
    return await this.serviceRepository.findOne({
      where: { id },
    });
  }

  async createService(serviceData: Partial<Service>): Promise<Service> {
    const service = this.serviceRepository.create(serviceData);
    return await this.serviceRepository.save(service);
  }

  async updateService(
    id: number,
    serviceData: Partial<Service>
  ): Promise<Service | null> {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      return null;
    }
    this.serviceRepository.merge(service, serviceData);
    return await this.serviceRepository.save(service);
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await this.serviceRepository.delete(id);
    return result.affected !== 0;
  }
}
