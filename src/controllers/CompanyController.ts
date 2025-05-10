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
