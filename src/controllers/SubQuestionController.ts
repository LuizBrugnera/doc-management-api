import { Request, Response } from "express";
import { SubQuestionService } from "../services/SubQuestionService";
import { QuestionService } from "../services/QuestionService";

export class SubQuestionController {
  private subQuestionService = new SubQuestionService();
  private questionService = new QuestionService();

  public getAllSubQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const subQuestions = await this.subQuestionService.getAllSubQuestions();
      res.json(subQuestions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getSubQuestionById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const subQuestion = await this.subQuestionService.getSubQuestionById(id);
      if (!subQuestion) {
        res.status(404).json({ message: "SubQuestion não encontrado" });
      }
      res.json(subQuestion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createSubQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = req.body;
      const question = await this.questionService.getQuestionById(
        data.questionId
      );
      if (!question) {
        res.status(404).json({ message: "Question não encontrada" });
        return;
      }
      data.question = question;
      const subQuestion = await this.subQuestionService.createSubQuestion(data);

      res.status(201).json(subQuestion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateSubQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const subQuestion = await this.subQuestionService.updateSubQuestion(
        id,
        data
      );
      if (!subQuestion) {
        res.status(404).json({ message: "SubQuestion não encontrado" });
      }
      res.json(subQuestion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteSubQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.subQuestionService.deleteSubQuestion(id);
      if (!success) {
        res.status(404).json({ message: "SubQuestion não encontrado" });
      }
      res.json({ message: "SubQuestion deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
