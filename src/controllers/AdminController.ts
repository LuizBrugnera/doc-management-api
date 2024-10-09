import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";

export class AdminController {
  private adminService = new AdminService();

  async getAllAdmins(req: Request, res: Response): Promise<void> {
    try {
      const admins = await this.adminService.getAllAdmins();
      res.json(admins);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAdminById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const admin = await this.adminService.getAdminById(id);
      if (!admin) {
        res.status(404).json({ message: "Administrador não encontrado" });
      }
      res.json(admin);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      const adminData = req.body;
      const admin = await this.adminService.createAdmin(adminData);
      res.status(201).json(admin);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAdmin(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const adminData = req.body;
      const admin = await this.adminService.updateAdmin(id, adminData);
      if (!admin) {
        res.status(404).json({ message: "Administrador não encontrado" });
      }
      res.json(admin);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAdmin(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.adminService.deleteAdmin(id);
      if (!success) {
        res.status(404).json({ message: "Administrador não encontrado" });
      }
      res.json({ message: "Administrador deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
