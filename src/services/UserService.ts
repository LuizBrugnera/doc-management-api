import { usernamesCache } from "../cache/usernamesCache";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserByKey(key: string, value: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { [key]: value },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ["emailUserDepartments"],
      select: {
        cnpj: true,
        rg: true,
        cpf: true,
        phone: true,
        cod: true,
        id: true,
        name: true,
        mainEmail: true,
        created_at: true,
        updated_at: true,
        emailUserDepartments: true,
        documents: false,
        password: false,
        notifications: false,
      },
    });
  }

  async getUserByNameInString(fileName: string): Promise<User | null> {
    if (
      usernamesCache.users.length === 0 ||
      usernamesCache.lastUpdate === null ||
      new Date(usernamesCache.lastUpdate.getTime() + 30 * 60 * 1000) <
        new Date()
    ) {
      const users = await this.userRepository.find({
        select: ["name"],
      });
      usernamesCache.users = users as { name: string }[];
      usernamesCache.lastUpdate = new Date();
    }

    const userNames = usernamesCache.users;
    for (let i = 0; i < userNames.length; i++) {
      const currentName = userNames[i].name;
      if (fileName.includes(currentName) && currentName !== "") {
        const user = await this.userRepository.findOne({
          where: { name: currentName },
        });
        return user || null;
      }
    }

    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { mainEmail: email },
      relations: ["documents", "notifications", "emailUserDepartments"],
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        cnpj: true,
        cod: true,
        cpf: true,
        phone: true,
        rg: true,
        id: true,
        name: true,
        mainEmail: true,
        created_at: true,
        updated_at: true,
        documents: false,
        emailUserDepartments: false,
        password: false,
        notifications: false,
      },
    });
  }

  async getUserByIdWithPassword(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    this.userRepository.merge(user, userData);
    return await this.userRepository.save(user);
  }

  async updatePasswordByEmail(email: string, password: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ mainEmail: email });
    if (!user) {
      return;
    }
    this.userRepository.update(user.id, { password });

    await this.userRepository.save(user);
  }

  async updatePasswordById(id: number, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    this.userRepository.update(user.id, { password });

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}
