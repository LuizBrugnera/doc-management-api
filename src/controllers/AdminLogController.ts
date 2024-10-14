import { Request, Response } from "express";
import { AdminLogService } from "../services/AdminLogService";

export class AdminLogController {
  private adminLogService = new AdminLogService();

  public getAllAdminLogs = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const adminLogs = await this.adminLogService.getAllAdminLogs();
      res.json(adminLogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getAdminLogById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const adminLog = await this.adminLogService.getAdminLogById(id);
      if (!adminLog) {
        res
          .status(404)
          .json({ message: "Log de administrador não encontrado" });
      }
      res.json(adminLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createAdminLog = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = req.body;
      const adminLog = await this.adminLogService.createAdminLog(data);
      res.status(201).json(adminLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateAdminLog = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const adminLog = await this.adminLogService.updateAdminLog(id, data);
      if (!adminLog) {
        res
          .status(404)
          .json({ message: "Log de administrador não encontrado" });
      }
      res.json(adminLog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteAdminLog = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.adminLogService.deleteAdminLog(id);
      if (!success) {
        res
          .status(404)
          .json({ message: "Log de administrador não encontrado" });
      }
      res.json({ message: "Log de administrador deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
