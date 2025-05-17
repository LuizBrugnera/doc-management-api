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

      // verifica se o cnpj já existe
      const exists = await this.companyService.checkIfExistsQuestionsWithCnpj(
        data.cnpj
      );

      if (exists) {
        res.status(400).json({ message: "Empresa já cadastrada" });
        return;
      }

      const company = await this.companyService.createCompany(data);

      const hash = company.hash;
      const email = company.email;
      const name = company.name;
      EmailHelper.sendMail({
        to: email,
        subject: "Cadastro de empresa realizado com sucesso!",
        html: `
          <div style="font-family: Arial, sans-serif; color:#333; background:#f9f9f9; padding:24px; border-radius:8px; max-width:620px; margin:0 auto; box-shadow:0 0 10px rgba(0,0,0,0.06);">
            <!-- Cabeçalho -->
            <h2 style="color:#2c3e50; text-align:center; margin-top:0;">
              ✅ Cadastro Realizado com Sucesso!
            </h2>
            <p style="font-size:16px; line-height:1.5;">
              A empresa <strong>${name}</strong>
              foi cadastrada com sucesso em nosso sistema.
            </p>
      
            <!-- Questionário -->
            <h3 style="color:#2c3e50; margin-bottom:8px;">📄 Acesse o questionário da empresa</h3>
            <p style="font-size:16px; line-height:1.5;">
              Clique no link abaixo para responder ao questionário psicossocial:
            </p>
            <p style="text-align:center; margin:20px 0;">
              <a href="https://acessoria-de-seguranca-do-trabalho.com/questionario/${hash}"
                 style="font-size:18px; font-weight:bold; color:#fff; background:#007bff; padding:12px 24px; border-radius:6px; text-decoration:none; display:inline-block;">
                Abrir Questionário
              </a>
            </p>
      
            <!-- Acesso à plataforma -->
            <h3 style="color:#2c3e50; margin-bottom:8px;">🔐 Acesso à Plataforma</h3>
            <p style="font-size:16px; line-height:1.5;">
              Para editar os dados da empresa ou consultar documentos, acesse:
              <br />
              <a href="https://acessoria-de-seguranca-do-trabalho.com/login" style="color:#007bff;">
                https://acessoria-de-seguranca-do-trabalho.com/login
              </a>
            </p>
            <ul style="font-size:16px; line-height:1.6; padding-left:18px; margin:8px 0;">
              <li><strong>Login:</strong> CNPJ completo da empresa (ex.: 12.345.678/0001-00)</li>
              <li><strong>Senha:</strong> 8 primeiros dígitos do CNPJ (ex.: 12345678)</li>
            </ul>
            <p style="font-size:15px; margin-top:4px;">
              Importante: selecione a opção <em>"Acesso via CNPJ"</em>.
              Após o primeiro acesso, recomendamos alterar a senha padrão em
              <strong>Minha Conta</strong>.
            </p>
      
            <!-- O que é possível fazer -->
            <h3 style="color:#2c3e50; margin-bottom:8px;">⚙ O que você pode fazer na plataforma</h3>
            <ul style="font-size:16px; line-height:1.6; padding-left:18px; margin:8px 0;">
              <li>Editar os dados da empresa</li>
              <li>Inserir ou atualizar funções e colaboradores</li>
              <li>Baixar os documentos emitidos</li>
              <li>Extrair o link do questionário psicossocial</li>
            </ul>
      
            <p style="font-size:16px; line-height:1.5;">Qualquer dúvida, estamos à disposição.</p>
      
            <p style="font-size:16px; font-weight:bold;">Equipe BETELSEG</p>
      
            <hr style="border:none; height:1px; background:#e0e0e0; margin:32px 0;" />
      
            <p style="font-size:12px; color:#777; text-align:center; margin:0;">
              © 2025 BETELSEG. Todos os direitos reservados.
            </p>
          </div>
        `,
        text: `
      ✅ Cadastro Realizado com Sucesso!
      
      A empresa ASSESSORIA EM SEGURANÇA DO TRABALHO LTDA foi cadastrada em nosso sistema.
      
      📄 Questionário:
      https://acessoria-de-seguranca-do-trabalho.com/questionario/${hash}
      
      🔐 Acesso à plataforma:
      https://acessoria-de-seguranca-do-trabalho.com/login
        • Login: CNPJ completo da empresa (ex.: 12.345.678/0001-00)
        • Senha: 8 primeiros dígitos do CNPJ (ex.: 12345678)
        (Use a opção "Acesso via CNPJ" e altere a senha em Minha Conta após o primeiro login.)
      
      ⚙ Na plataforma você poderá:
        • Editar os dados da empresa
        • Inserir ou atualizar funções e colaboradores
        • Baixar os documentos emitidos
        • Extrair o link do questionário psicossocial
      
      Equipe BETELSEG – © 2025
      `,
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
