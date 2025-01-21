import { Request, Response } from "express";
import { ServiceDataService } from "../services/ServiceDataService";

export class ServiceDataController {
  private serviceDataService = new ServiceDataService();

  public getAllServiceDatas = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const serviceDatas = await this.serviceDataService.getAllServiceDatas();
      res.json(serviceDatas);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getServiceDataById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = await this.serviceDataService.getServiceDataById(id);
      if (!serviceData) {
        res.status(404).json({ message: "ServiceDataistrador não encontrado" });
      }
      res.json(serviceData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createServiceData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const serviceDataData = req.body;
      const serviceData = await this.serviceDataService.createServiceData(
        serviceDataData
      );
      res.status(201).json(serviceData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateServiceData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const serviceDataData = req.body;
      const serviceData = await this.serviceDataService.updateServiceData(
        id,
        serviceDataData
      );
      if (!serviceData) {
        res.status(404).json({ message: "ServiceDataistrador não encontrado" });
      }
      res.json(serviceData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteServiceData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.serviceDataService.deleteServiceData(id);
      if (!success) {
        res.status(404).json({ message: "ServiceDataistrador não encontrado" });
      }
      res.json({ message: "ServiceDataistrador deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
