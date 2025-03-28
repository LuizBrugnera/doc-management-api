import { Request, Response } from "express";
import { OsHistoricService } from "../services/OsHistoricService";
import { Os } from "../entities/Os";

export class OsHistoricController {
  private osHistoricService = new OsHistoricService();

  public getAllOsHistoric = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const osHistorics = await this.osHistoricService.getAllOsHistoric();
      res.json(osHistorics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getOsHistoricById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const osHistoric = await this.osHistoricService.getOsHistoricById(+id);
      if (!osHistoric) {
        res.status(404).json({ message: "OsHistoric não encontrado" });
        return;
      }
      res.json(osHistoric);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getAllOsHistoricByOsId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const osHistorics = await this.osHistoricService.getAllOsHistoricByOsId(
        +id
      );
      res.json(osHistorics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createOsHistoric = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { status, description, lastUpdate, osId } = req.body;
      const osHistoric = await this.osHistoricService.createOsHistoric({
        status,
        description,
        lastUpdate,
        os: { id: +osId } as Os,
      });

      if (!osHistoric) {
        res.status(404).json({ message: "OsHistoric não encontrado" });
        return;
      }
      res.json(osHistoric);
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
