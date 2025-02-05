import { Request, Response } from "express";
import { OsService } from "../services/OsService";

export class OsController {
  private osService = new OsService();

  public updateOsWithServices = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await this.osService.updateOsWithServices();
      res.json({ message: "Os atualizados com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getAllOss = async (req: Request, res: Response): Promise<void> => {
    try {
      const oss = await this.osService.getAllOss();
      res.json(oss);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getOsById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const os = await this.osService.getOsById(id);
      if (!os) {
        res.status(404).json({ message: "Osistrador não encontrado" });
      }
      res.json(os);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createOs = async (req: Request, res: Response): Promise<void> => {
    try {
      const osData = req.body;
      const os = await this.osService.createOs(osData);
      res.status(201).json(os);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateOs = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const osData = req.body;
      const os = await this.osService.updateOs(id, osData);
      if (!os) {
        res.status(404).json({ message: "Osistrador não encontrado" });
      }
      res.json(os);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteOs = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.osService.deleteOs(id);
      if (!success) {
        res.status(404).json({ message: "Osistrador não encontrado" });
      }
      res.json({ message: "Osistrador deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
