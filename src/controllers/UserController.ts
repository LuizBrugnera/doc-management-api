import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userData = req.body;
      const user = await this.userService.updateUser(id, userData);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.userService.deleteUser(id);
      if (!success) {
        res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
