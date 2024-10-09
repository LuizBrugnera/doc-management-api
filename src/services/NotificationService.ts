import { AppDataSource } from "../data-source";
import { Notification } from "../entities/Notification";
import { User } from "../entities/User";

export class NotificationService {
  private notificationRepository = AppDataSource.getRepository(Notification);
  private userRepository = AppDataSource.getRepository(User);

  async getAllNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find({ relations: ["user"] });
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    return await this.notificationRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async createNotification(
    notificationData: Partial<Notification>
  ): Promise<Notification> {
    const user = await this.userRepository.findOneBy({
      id: notificationData.user?.id,
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const notification = this.notificationRepository.create({
      ...notificationData,
      user,
    });
    return await this.notificationRepository.save(notification);
  }

  async updateNotification(
    id: number,
    notificationData: Partial<Notification>
  ): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) {
      return null;
    }
    this.notificationRepository.merge(notification, notificationData);
    return await this.notificationRepository.save(notification);
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await this.notificationRepository.delete(id);
    return result.affected !== 0;
  }
}
