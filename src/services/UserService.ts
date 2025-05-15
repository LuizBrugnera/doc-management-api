import axios from "axios";
import { usernamesCache } from "../cache/usernamesCache";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { AuthService } from "./AuthService";
import { EmailUserDepartmentService } from "./EmailUserDepartmentService";
import { AddressService } from "./AddressService";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private authService = new AuthService();
  private emailUserDepartmentService = new EmailUserDepartmentService();
  private addressService = new AddressService();
  private API_URL = process.env.API_GESTAO_URL || "";
  private API_TOKEN = process.env.API_GESTAO_TOKEN || "";
  private API_SECRET = process.env.API_GESTAO_SECRET || "";

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
        lastLogin: true,
      },
    });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, { lastLogin: new Date() });
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

  private normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .replace(/Ç/g, "C")
      .replace(/ó/g, "o")
      .replace(/Ó/g, "O")
      .toUpperCase();
  }

  private async fetchTotalPages(): Promise<number> {
    try {
      const response = await axios.get(`${this.API_URL}1`, {
        headers: {
          "access-token": this.API_TOKEN,
          "secret-access-token": this.API_SECRET,
        },
      });
      return response.data.meta.total_paginas || 1;
    } catch (error) {
      throw new Error(`Failed to fetch total pages: ${error}`);
    }
  }

  private async fetchUsersByPage(page: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_URL}${page}`, {
        headers: {
          "access-token": this.API_TOKEN,
          "secret-access-token": this.API_SECRET,
        },
      });
      return response.data.data || [];
    } catch (error) {
      return [];
    }
  }

  private generatePassword(cpf?: string, cnpj?: string): string | null {
    if (cnpj) {
      return cnpj.replace(/\D/g, "").slice(0, 8);
    }
    if (cpf) {
      return cpf.replace(/\D/g, "").slice(0, 8);
    }
    return null;
  }

  private async processUser(userData: any): Promise<void> {
    const {
      id,
      razao_social,
      email,
      cpf,
      rg,
      cnpj,
      celular,
      contatos,
      enderecos,
    } = userData;
    /* 
    enderecos : [
                {
                    "endereco": {
                        "tipo_id": "",
                        "nome_tipo": "",
                        "cep": "04530-030",
                        "logradouro": "Rua Tenente Negrão",
                        "numero": "140",
                        "complemento": "EDIF J. K. - CONJ 51 AND. 5",
                        "bairro": "Itaim Bibi",
                        "pais": "Brasil",
                        "cidade_id": "5351",
                        "nome_cidade": "São Paulo",
                        "estado": "SP"
                    }
                }
            ],
    */
    if (!razao_social) {
      return;
    }

    const password = this.generatePassword(cpf, cnpj);
    if (!password) {
      return;
    }

    const userEmail = email || `${password}@example.com`;

    try {
      const userExists = await this.getUserByKey("cod", id);

      if (!userExists) {
        const hashedPassword = await this.authService.hashPassword(password);
        const createdUser = await this.createUser({
          name: this.normalizeText(razao_social),
          cod: id,
          mainEmail: userEmail,
          cpf,
          rg,
          cnpj,
          password: hashedPassword,
          phone: celular,
        });

        if (enderecos && enderecos.length > 0) {
          enderecos.forEach(async (address: { endereco: any }) => {
            await this.addressService.createAddress({
              user: createdUser,
              cep: address.endereco.cep,
              logradouro: address.endereco.logradouro,
              numero: address.endereco.numero,
              complemento: address.endereco.complemento,
              bairro: address.endereco.bairro,
              pais: address.endereco.pais,
              cidade: address.endereco.nome_cidade,
              estado: address.endereco.estado,
            });
          });
        }

        if (contatos && contatos.length > 0) {
          contatos.forEach(async (contact: { contato: any }) => {
            await this.emailUserDepartmentService.createAssociation({
              user: createdUser,
              email: contact.contato.contato,
              department: contact.contato.nome_tipo,
            });
          });
        }
      } else {
        if (contatos && contatos.length > 0) {
          const contactsExists =
            await this.emailUserDepartmentService.getAssociationByUserId(
              userExists.id
            );

          contatos.forEach(async (contact: { contato: any }) => {
            const contactExists = contactsExists.find(
              (contactExists) => contactExists.email === contact.contato.contato
            );
            if (!contactExists) {
              await this.emailUserDepartmentService.createAssociation({
                user: userExists,
                email: contact.contato.contato,
                department: contact.contato.nome_tipo,
              });
            }
          });
        }

        if (enderecos && enderecos.length > 0) {
          const addressesExists =
            await this.addressService.getAllAddressesByUserName(razao_social);

          enderecos.forEach(async (address: { endereco: any }) => {
            const addressExists = addressesExists.find(
              (addressExists) =>
                addressExists.logradouro === address.endereco.logradouro &&
                addressExists.numero === address.endereco.numero &&
                addressExists.bairro === address.endereco.bairro &&
                addressExists.cidade === address.endereco.nome_cidade &&
                addressExists.estado === address.endereco.estado &&
                addressExists.cep === address.endereco.cep
            );
            if (!addressExists) {
              await this.addressService.createAddress({
                user: userExists,
                cep: address.endereco.cep,
                logradouro: address.endereco.logradouro,
                numero: address.endereco.numero,
                complemento: address.endereco.complemento,
                bairro: address.endereco.bairro,
                pais: address.endereco.pais,
                cidade: address.endereco.nome_cidade,
                estado: address.endereco.estado,
              });
            }
          });
        }

        await this.updateUser(userExists.id, {
          mainEmail: userEmail,
          phone: celular,
          rg: rg,
          cpf: cpf,
          cnpj: cnpj,
        });
      }
    } catch (error) {}
  }

  public async updateUsersDbWithGestao(): Promise<void> {
    try {
      const totalPages = await this.fetchTotalPages();
      for (let page = 1; page <= totalPages; page++) {
        const users = await this.fetchUsersByPage(page);

        const userPromises = users.map((user) => this.processUser(user));
        await Promise.all(userPromises);
      }
    } catch (error) {}
  }
}
