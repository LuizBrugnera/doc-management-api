import { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService";

export class NotificationController {
  private notificationService = new NotificationService();

  async getAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const notifications =
        await this.notificationService.getAllNotifications();
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const notification = await this.notificationService.getNotificationById(
        id
      );
      if (!notification) {
        res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.json(notification);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const notificationData = req.body;
      const notification = await this.notificationService.createNotification(
        notificationData
      );
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateNotification(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const notificationData = req.body;
      const notification = await this.notificationService.updateNotification(
        id,
        notificationData
      );
      if (!notification) {
        res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.json(notification);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.notificationService.deleteNotification(id);
      if (!success) {
        res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.json({ message: "Notificação deletada com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}