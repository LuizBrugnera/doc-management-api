import { Request, Response } from "express";
import { DepartmentService } from "../services/DepartmentService";
import { FolderAccessService } from "../services/FolderAccessService";
import { AuthService } from "../services/AuthService";

export class DepartmentController {
  private departmentService = new DepartmentService();
  private folderAccessService = new FolderAccessService();
  private authService = new AuthService();

  public getAllDepartments = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const departments = await this.departmentService.getAllDepartments();
      res.json(departments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getDepartmentById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
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
  };

  public getDepartmentsByDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const department = req.params.department;
      const departments =
        await this.departmentService.getDepartmentByDepartment(department);
      res.json(departments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const departmentData = req.body;
      const department = await this.departmentService.createDepartment(
        departmentData
      );
      res.status(201).json(department);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const departmentData = req.body;

      const department = await this.departmentService.getDepartmentById(id);

      if (!department) {
        res.status(404).json({ message: "Departamento não encontrado" });
        return;
      }
      const newFolderAccess = [];
      if (departmentData.foldersAccess.length !== 0) {
        departmentData.foldersAccess.forEach(
          async (folder: {
            foldername: string;
            id: number | null | undefined;
          }) => {
            if (!folder.id) {
              const folderCreated =
                await this.folderAccessService.createFolderAccess({
                  foldername: folder.foldername,
                  department: department,
                });
              newFolderAccess.push(folderCreated);
            } else {
              newFolderAccess.push(folder);
            }
          }
        );
      }

      if (req.user?.role === "admin" && departmentData.password) {
        departmentData.password = await this.authService.hashPassword(
          departmentData.password
        );
      } else {
        departmentData.password = department.password;
      }

      const departmentUpdated = await this.departmentService.updateDepartment(
        id,
        departmentData
      );

      res.json(departmentUpdated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
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
  };
}
