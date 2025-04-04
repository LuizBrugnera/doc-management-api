import { Request, Response } from "express";
import { EmailTemplateService } from "../services/EmailTemplateService";

export class EmailTemplateController {
  private emailTemplateService = new EmailTemplateService();

  public getAllEmailTemplates = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const emailTemplates =
        await this.emailTemplateService.getAllEmailTemplates();
      res.json(emailTemplates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getEmailTemplateById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const emailTemplate =
        await this.emailTemplateService.getEmailTemplateById(id);
      if (!emailTemplate) {
        res.status(404).json({ message: "EmailTemplate não encontrado" });
      }
      res.json(emailTemplate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getEmailsTemplateByOwnerId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const ownerId = req.user?.id;
      const role = req.user?.role;
      if (!ownerId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      if (role === "department") {
        const emailTemplates =
          await this.emailTemplateService.getEmailsTemplateByDepartmentId(
            ownerId
          );

        if (!emailTemplates) {
          res.status(404).json({ message: "EmailTemplate não encontrado" });
          return;
        }
        res.json(emailTemplates);
        return;
      } else if (role === "admin") {
        const emailTemplates =
          await this.emailTemplateService.getEmailsTemplateByAdminId(ownerId);
        if (!emailTemplates) {
          res.status(404).json({ message: "EmailTemplate não encontrado" });
          return;
        }

        res.json(emailTemplates);
        return;
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createEmailTemplate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = req.body;
      const role = req.user?.role;
      const id = req.user?.id;
      if (role === "department") {
        const emailTemplate =
          await this.emailTemplateService.createEmailTemplate({
            ...data,
            department: { id },
          });
        res.status(201).json(emailTemplate);
      } else if (role === "admin") {
        const emailTemplate =
          await this.emailTemplateService.createEmailTemplate({
            ...data,
            admin: { id },
          });
        res.status(201).json(emailTemplate);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateEmailTemplate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;

      const emailTemplate = await this.emailTemplateService.updateEmailTemplate(
        id,
        data
      );
      if (!emailTemplate) {
        res.status(404).json({ message: "EmailTemplate não encontrado" });
        return;
      }
      res.json(emailTemplate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteEmailTemplate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.emailTemplateService.deleteEmailTemplate(id);
      if (!success) {
        res.status(404).json({ message: "EmailTemplate não encontrado" });
      }
      res.json({ message: "EmailTemplate deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
