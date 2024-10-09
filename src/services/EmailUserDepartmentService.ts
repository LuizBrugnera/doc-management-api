import { AppDataSource } from "../data-source";
import { EmailUserDepartment } from "../entities/EmailUserDepartment";
import { User } from "../entities/User";

export class EmailUserDepartmentService {
  private emailUserDepartmentRepository =
    AppDataSource.getRepository(EmailUserDepartment);
  private userRepository = AppDataSource.getRepository(User);

  async getAllAssociations(): Promise<EmailUserDepartment[]> {
    return await this.emailUserDepartmentRepository.find({
      relations: ["user"],
    });
  }

  async getAssociationById(id: number): Promise<EmailUserDepartment | null> {
    return await this.emailUserDepartmentRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async createAssociation(
    data: Partial<EmailUserDepartment>
  ): Promise<EmailUserDepartment> {
    const user = await this.userRepository.findOneBy({ id: data.user?.id });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const association = this.emailUserDepartmentRepository.create({
      ...data,
      user,
    });
    return await this.emailUserDepartmentRepository.save(association);
  }

  async updateAssociation(
    id: number,
    data: Partial<EmailUserDepartment>
  ): Promise<EmailUserDepartment | null> {
    const association = await this.emailUserDepartmentRepository.findOneBy({
      id,
    });
    if (!association) {
      return null;
    }
    this.emailUserDepartmentRepository.merge(association, data);
    return await this.emailUserDepartmentRepository.save(association);
  }

  async deleteAssociation(id: number): Promise<boolean> {
    const result = await this.emailUserDepartmentRepository.delete(id);
    return result.affected !== 0;
  }
}
