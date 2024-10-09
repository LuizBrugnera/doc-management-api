import { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService";

export class NotificationController {
  private notificationService = new NotificationService();

  async getAllNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const notifications =
        await this.notificationService.getAllNotifications();
      return res.json(notifications);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getNotificationById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const notification = await this.notificationService.getNotificationById(
        id
      );
      if (!notification) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      return res.json(notification);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createNotification(req: Request, res: Response): Promise<Response> {
    try {
      const notificationData = req.body;
      const notification = await this.notificationService.createNotification(
        notificationData
      );
      return res.status(201).json(notification);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateNotification(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const notificationData = req.body;
      const notification = await this.notificationService.updateNotification(
        id,
        notificationData
      );
      if (!notification) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      return res.json(notification);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.notificationService.deleteNotification(id);
      if (!success) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      return res.json({ message: "Notificação deletada com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
