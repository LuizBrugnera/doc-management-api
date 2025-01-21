import { Request, Response } from "express";
import { ServiceService } from "../services/ServiceService";

export class ServiceController {
  private serviceService = new ServiceService();

  public getAllServices = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const services = await this.serviceService.getAllServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getServiceById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const service = await this.serviceService.getServiceById(id);
      if (!service) {
        res.status(404).json({ message: "Serviceistrador não encontrado" });
      }
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createService = async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceData = req.body;
      const service = await this.serviceService.createService(serviceData);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateService = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = req.body;
      const service = await this.serviceService.updateService(id, serviceData);
      if (!service) {
        res.status(404).json({ message: "Serviceistrador não encontrado" });
      }
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteService = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.serviceService.deleteService(id);
      if (!success) {
        res.status(404).json({ message: "Serviceistrador não encontrado" });
      }
      res.json({ message: "Serviceistrador deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
