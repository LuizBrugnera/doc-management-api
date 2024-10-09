import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const userData = req.body;
      const user = await this.userService.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.userService.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.json({ message: "Usuário deletado com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
