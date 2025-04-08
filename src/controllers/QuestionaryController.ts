import { Request, Response } from "express";
import { QuestionaryService } from "../services/QuestionaryService";

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
