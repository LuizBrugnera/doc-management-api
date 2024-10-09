import { Request, Response } from "express";
import { DepartmentService } from "../services/DepartmentService";

export class DepartmentController {
  private departmentService = new DepartmentService();

  async getAllDepartments(req: Request, res: Response): Promise<void> {
    try {
      const departments = await this.departmentService.getAllDepartments();
      res.json(departments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDepartmentById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const department = await this.departmentService.getDepartmentById(id);
      if (!department) {
        res.status(404).json({ message: "Departamento não encontrado" });
      }
      res.json(department);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const departmentData = req.body;
      const department = await this.departmentService.createDepartment(
        departmentData
      );
      res.status(201).json(department);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const departmentData = req.body;
      const department = await this.departmentService.updateDepartment(
        id,
        departmentData
      );
      if (!department) {
        res.status(404).json({ message: "Departamento não encontrado" });
      }
      res.json(department);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.departmentService.deleteDepartment(id);
      if (!success) {
        res.status(404).json({ message: "Departamento não encontrado" });
      }
      res.json({ message: "Departamento deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
