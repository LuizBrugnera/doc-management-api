import { Request, Response } from "express";
import { LogService } from "../services/LogService";

export class LogController {
  private logService = new LogService();

  public getAllLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const logs = await this.logService.getAllLogs();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getLogById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const log = await this.logService.getLogById(id);
      if (!log) {
        res.status(404).json({ message: "Log não encontrado" });
      }
      res.json(log);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const log = await this.logService.createLog(data);
      res.status(201).json(log);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const log = await this.logService.updateLog(id, data);
      if (!log) {
        res.status(404).json({ message: "Log não encontrado" });
      }
      res.json(log);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.logService.deleteLog(id);
      if (!success) {
        res.status(404).json({ message: "Log não encontrado" });
      }
      res.json({ message: "Log deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
