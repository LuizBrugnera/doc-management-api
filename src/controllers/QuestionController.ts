import { Request, Response } from "express";
import { QuestionService } from "../services/QuestionService";

export class QuestionController {
  private questionService = new QuestionService();

  public getAllQuestions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const questions = await this.questionService.getAllQuestions();
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getQuestionById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const question = await this.questionService.getQuestionById(id);
      if (!question) {
        res.status(404).json({ message: "Question não encontrado" });
      }
      res.json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = req.body;
      const question = await this.questionService.createQuestion(data);

      res.status(201).json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const question = await this.questionService.updateQuestion(id, data);
      if (!question) {
        res.status(404).json({ message: "Question não encontrado" });
      }
      res.json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteQuestion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.questionService.deleteQuestion(id);
      if (!success) {
        res.status(404).json({ message: "Question não encontrado" });
      }
      res.json({ message: "Question deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
