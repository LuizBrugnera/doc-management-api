import { AppDataSource } from "../data-source";
import { ServiceData } from "../entities/ServiceData";

export class ServiceDataService {
  private serviceDataRepository = AppDataSource.getRepository(ServiceData);

  async getAllServiceDatas(): Promise<ServiceData[]> {
    return await this.serviceDataRepository.find();
  }

  async getServiceDataById(id: number): Promise<ServiceData | null> {
    return await this.serviceDataRepository.findOne({
      where: { id },
    });
  }

  async createServiceData(
    serviceDataData: Partial<ServiceData>
  ): Promise<ServiceData> {
    const serviceData = this.serviceDataRepository.create(serviceDataData);
    return await this.serviceDataRepository.save(serviceData);
  }
  async getServiceDataByKey(
    key: string,
    value: string
  ): Promise<ServiceData | null> {
    return await this.serviceDataRepository.findOne({
      where: { [key]: value },
    });
  }

  async updateServiceData(
    id: number,
    serviceDataData: Partial<ServiceData>
  ): Promise<ServiceData | null> {
    const serviceData = await this.serviceDataRepository.findOneBy({ id });
    if (!serviceData) {
      return null;
    }
    this.serviceDataRepository.merge(serviceData, serviceDataData);
    return await this.serviceDataRepository.save(serviceData);
  }

  async deleteServiceData(id: number): Promise<boolean> {
    const result = await this.serviceDataRepository.delete(id);
    return result.affected !== 0;
  }
}
