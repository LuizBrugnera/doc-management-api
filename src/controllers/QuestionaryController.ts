import { Request, Response } from "express";
import { QuestionaryService } from "../services/QuestionaryService";
import { EmailHelper } from "../helper/EmailHelper";

export class QuestionaryController {
  private questionaryService = new QuestionaryService();

  public getAllQuestionarys = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const questionarys = await this.questionaryService.getAllQuestionarys();
      res.json(questionarys);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public CheckIfExistsQuestionsWithCpf = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const cpf = req.params.cpf;
      const exists =
        await this.questionaryService.checkIfExistsQuestionsWithCpf(cpf);
      res.json(exists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public CheckIfExistsQuestionsWithHash = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const hash = req.params.hash;
      const exists =
        await this.questionaryService.checkIfExistsQuestionsWithHash(hash);
      res.json(exists);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getQuestionaryById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const questionary = await this.questionaryService.getQuestionaryById(id);
      if (!questionary) {
        res.status(404).json({ message: "Questionary não encontrado" });
      }
      res.json(questionary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createQuestionary = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = req.body;
      const questionary = await this.questionaryService.createQuestionary(data);

      const hash = questionary.hash;
      const email = questionary.email;
      EmailHelper.sendMail({
        to: email,
        subject: "Comprovante do Relatório de Avaliação Psicossocial",
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #2c3e50; text-align: center;">Comprovante de Envio</h2>
      <p style="font-size: 16px; color: #555;">Olá,</p>
      <p style="font-size: 16px; color: #555;">O codigo do seu comprovante do Relatório de Avaliação Psicossocial é: </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 22px; font-weight: bold; color: #007bff; background-color: #e7f3ff; padding: 10px 20px; border-radius: 5px; display: inline-block;">${hash}</span>
      </div>
      <br/>
      <p style="font-size: 16px; color: #555;">Atenciosamente,</p>
      <p style="font-size: 16px; color: #555; font-weight: bold;">Equipe BETELSEG</p>
      <hr style="border: none; height: 1px; background-color: #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">© 2024 BETELSEG. Todos os direitos reservados.</p>
    </div>`,
        text: `O codigo do seu comprovante do Relatório de Avaliação Psicossocial é: ${hash}`,
      });

      res.status(201).json(questionary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateQuestionary = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const questionary = await this.questionaryService.updateQuestionary(
        id,
        data
      );
      if (!questionary) {
        res.status(404).json({ message: "Questionary não encontrado" });
      }
      res.json(questionary);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteQuestionary = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.questionaryService.deleteQuestionary(id);
      if (!success) {
        res.status(404).json({ message: "Questionary não encontrado" });
      }
      res.json({ message: "Questionary deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
