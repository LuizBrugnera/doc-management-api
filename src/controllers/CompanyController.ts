import { Request, Response } from "express";
import { CompanyService } from "../services/CompanyService";
import { EmailHelper } from "../helper/EmailHelper";

export class CompanyController {
  private companyService = new CompanyService();

  public getAllCompanys = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const companys = await this.companyService.getAllCompanys();
      res.json(companys);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getCompanyByCnpj = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const cnpj = req.body.cnpj;
      const company = await this.companyService.getCompanyByCnpj(cnpj);
      if (!company) {
        res.status(404).json({ message: "Company não encontrado" });
      }
      res.json(company);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getCompanyByHash = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const hash = req.params.hash;
    const company = await this.companyService.getCompanyByHash(hash);
    if (!company) {
      res.status(404).json({ message: "Company não encontrado" });
      return;
    }

    res.json(company);
  };

  public CheckIfExistsQuestionsWithHash = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const hash = req.params.hash;
      const exists = await this.companyService.checkIfExistsQuestionsWithHash(
        hash
      );
      res.json(!!exists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public checkIfExistsQuestionsWithCnpj = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const cnpj = req.body.cnpj;
      const exists = await this.companyService.checkIfExistsQuestionsWithCnpj(
        cnpj
      );
      res.json(exists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getCompanyById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const company = await this.companyService.getCompanyById(id);
      if (!company) {
        res.status(404).json({ message: "Company não encontrado" });
      }
      res.json(company);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      data.completed = false;
      const company = await this.companyService.createCompany(data);

      const hash = company.hash;
      const email = company.email;
      EmailHelper.sendMail({
        to: email,
        subject: "Cadastro de empresa para Avaliação Psicossocial",
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  <h2 style="color: #2c3e50; text-align: center;">Link Personalizado</h2>

  <p style="font-size: 16px; color: #555;">Olá,</p>
  <p style="font-size: 16px; color: #555;">
    O seu link personalizado para o questionário de avaliação psicossocial é:
  </p>

  <div style="text-align: center; margin: 20px 0;">
    <span style="font-size: 22px; font-weight: bold; color: #007bff; background-color: #e7f3ff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
      https://acessoria-de-seguranca-do-trabalho.com/questionario/${hash}
    </span>
  </div>

  <!-- Novo parágrafo sobre a plataforma -->
  <p style="font-size: 16px; color: #555;">
    A plataforma
    <strong>acessoria-de-seguranca-do-trabalho.com</strong>
    é a área exclusiva do cliente BetelSeg. Nela, você pode consultar todos os
    documentos relacionados à sua empresa, editar ou atualizar as informações
    cadastrais necessárias para este questionário e, sempre que precisar,
    adicionar novos colaboradores ou ajustar os dados dos já cadastrados.
    Assim, mantemos seu relatório psicossocial sempre em dia e em
    conformidade com as normas.
  </p>

  <p style="font-size: 16px; color: #555;">Atenciosamente,</p>
  <p style="font-size: 16px; color: #555; font-weight: bold;">Equipe BETELSEG</p>

  <hr style="border: none; height: 1px; background-color: #eee; margin: 20px 0;" />

  <p style="font-size: 12px; color: #999; text-align: center;">
    © 2024 BETELSEG. Todos os direitos reservados.
  </p>
</div>`,
        text: `O seu link personalizado para o questionário para o relatório de avaliação psicossocial é: ${hash}`,
      });

      res.status(201).json(company);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const company = await this.companyService.updateCompany(id, data);
      if (!company) {
        res.status(404).json({ message: "Company não encontrado" });
      }
      res.json(company);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.companyService.deleteCompany(id);
      if (!success) {
        res.status(404).json({ message: "Company não encontrado" });
      }
      res.json({ message: "Company deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
