import { AppDataSource } from "../data-source";
import { Company } from "../entities/Company";

export class CompanyService {
  private companyRepository = AppDataSource.getRepository(Company);

  async getAllCompanys(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  public async generateUniqueHash(length = 5): Promise<string> {
    const maxAttempts = 10000;

    for (let i = 0; i < maxAttempts; i++) {
      const hash = Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, "0");

      const exists = await this.checkIfExistsQuestionsWithHash(hash);
      if (!exists) return hash;
    }

    throw new Error("Não foi possível gerar um hash único.");
  }

  async checkIfExistsQuestionsWithHash(hash: string): Promise<boolean> {
    const exists = await this.companyRepository.findOne({
      where: { hash },
    });
    return !!exists;
  }

  async checkIfExistsQuestionsWithCnpj(cnpj: string): Promise<boolean> {
    const exists = await this.companyRepository.findOne({
      where: { cnpj },
    });
    return !!exists;
  }

  async getCompanyById(id: number): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { id },
    });
  }

  async getCompanyByHash(hash: string): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { hash },
    });
  }

  async getCompanyByCnpj(cnpj: string): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { cnpj },
    });
  }

  async createCompany(data: Partial<Company>): Promise<Company> {
    const hash = await this.generateUniqueHash();
    const company = this.companyRepository.create({ ...data, hash });
    return await this.companyRepository.save(company);
  }

  async updateCompany(
    id: number,
    data: Partial<Company>
  ): Promise<Company | null> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      return null;
    }
    this.companyRepository.merge(company, data);
    return await this.companyRepository.save(company);
  }

  async deleteCompany(id: number): Promise<boolean> {
    const result = await this.companyRepository.delete(id);
    return result.affected !== 0;
  }
}
