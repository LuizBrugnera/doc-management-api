import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";

export class UserController {
  private userService = new UserService();
  private authService = new AuthService();

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
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
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (id !== req.user?.id && req.user?.role !== "admin") {
        res.status(401).json({ message: "Não Autorizado!" });
        return;
      }

      const userData = req.body;

      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      if (req.user?.role === "admin" && userData.password) {
        userData.password = await this.authService.hashPassword(
          userData.password
        );
      } else {
        userData.password = user.password;
      }

      const userUpdated = await this.userService.updateUser(id, userData);
      if (!userUpdated) {
        res.status(404).json({ message: "Usuário não encontrado" });
      }
      res.json(userUpdated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
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
  };
}
