import { AppDataSource } from "../data-source";
import { EmailTemplate } from "../entities/EmailTemplate";
import { Department } from "../entities/Department";

export class EmailTemplateService {
  private emailTemplateRepository = AppDataSource.getRepository(EmailTemplate);
  private departmentRepository = AppDataSource.getRepository(Department);
  private adminRepository = AppDataSource.getRepository(Department);

  async getAllEmailTemplates(): Promise<EmailTemplate[]> {
    return await this.emailTemplateRepository.find();
  }

  async getEmailTemplateById(id: number): Promise<EmailTemplate | null> {
    return await this.emailTemplateRepository.findOne({
      where: { id },
    });
  }

  async createEmailTemplate(
    data: Partial<EmailTemplate>
  ): Promise<EmailTemplate> {
    if (data.department?.id) {
      const department = await this.departmentRepository.findOneBy({
        id: data.department?.id,
      });
      if (!department) {
        throw new Error("Departamento não encontrado");
      }
    }

    if (data.admin?.id) {
      const admin = await this.adminRepository.findOneBy({
        id: data.admin?.id,
      });

      if (!admin) {
        throw new Error("Admin não encontrado");
      }
    }
    const emailTemplate = this.emailTemplateRepository.create({ ...data });
    return await this.emailTemplateRepository.save(emailTemplate);
  }

  async getEmailsTemplateByAdminId(adminId: number): Promise<EmailTemplate[]> {
    return await this.emailTemplateRepository.find({
      where: { admin: { id: adminId } },
    });
  }

  async getEmailsTemplateByDepartmentId(
    departmentId: number
  ): Promise<EmailTemplate[]> {
    return await this.emailTemplateRepository.find({
      where: { department: { id: departmentId } },
    });
  }

  async updateEmailTemplate(
    id: number,
    data: Partial<EmailTemplate>
  ): Promise<EmailTemplate | null> {
    const emailTemplate = await this.emailTemplateRepository.findOneBy({ id });
    if (!emailTemplate) {
      return null;
    }
    this.emailTemplateRepository.merge(emailTemplate, data);
    return await this.emailTemplateRepository.save(emailTemplate);
  }

  async deleteEmailTemplate(id: number): Promise<boolean> {
    const result = await this.emailTemplateRepository.delete(id);
    return result.affected !== 0;
  }
}
