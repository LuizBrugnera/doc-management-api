import { Request, Response } from "express";
import { DepartmentService } from "../services/DepartmentService";

export class DepartmentController {
  private departmentService = new DepartmentService();

  async getAllDepartments(req: Request, res: Response): Promise<Response> {
    try {
      const departments = await this.departmentService.getAllDepartments();
      return res.json(departments);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getDepartmentById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const department = await this.departmentService.getDepartmentById(id);
      if (!department) {
        return res.status(404).json({ message: "Departamento não encontrado" });
      }
      return res.json(department);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createDepartment(req: Request, res: Response): Promise<Response> {
    try {
      const departmentData = req.body;
      const department = await this.departmentService.createDepartment(
        departmentData
      );
      return res.status(201).json(department);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateDepartment(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const departmentData = req.body;
      const department = await this.departmentService.updateDepartment(
        id,
        departmentData
      );
      if (!department) {
        return res.status(404).json({ message: "Departamento não encontrado" });
      }
      return res.json(department);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteDepartment(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.departmentService.deleteDepartment(id);
      if (!success) {
        return res.status(404).json({ message: "Departamento não encontrado" });
      }
      return res.json({ message: "Departamento deletado com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
