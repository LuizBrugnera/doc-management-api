import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { AppDataSource } from "../data-source";

dotenv.config();

class UserUpdater {
  private API_URL: string;
  private API_TOKEN: string;
  private API_SECRET: string;
  private userService: UserService;
  private authService: AuthService;
  private logFile: string;

  constructor() {
    this.API_URL = process.env.API_GESTAO_URL || "";
    this.API_TOKEN = process.env.API_GESTAO_TOKEN || "";
    this.API_SECRET = process.env.API_GESTAO_SECRET || "";
    this.userService = new UserService();
    this.authService = new AuthService();
    this.logFile = "missing_email.log";
  }

  private logErrorToFile(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFile(this.logFile, logMessage, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  }

  private normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
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
      console.error(`Error fetching users on page ${page}:`, error);
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
    const { id, razao_social, email, cpf, rg, cnpj, celular } = userData;

    if (!razao_social) {
      console.warn(`User with ID ${id} has invalid 'razao_social'. Skipping.`);
      return;
    }

    const password = this.generatePassword(cpf, cnpj);
    if (!password) {
      console.warn(
        `User with ID ${id} and name '${razao_social}' lacks valid CPF or CNPJ. Skipping.`
      );
      return;
    }

    const userEmail = email || `${password}@example.com`;
    if (!email) {
      this.logErrorToFile(
        `User with ID ${id} and name '${razao_social}' lacks a valid email. Assigned temporary email '${userEmail}'.`
      );
    }

    try {
      const userExists = await this.userService.getUserByKey("cod", id);

      if (!userExists) {
        const hashedPassword = await this.authService.hashPassword(password);
        await this.userService.createUser({
          name: this.normalizeText(razao_social),
          cod: id,
          mainEmail: userEmail,
          cpf,
          rg,
          cnpj,
          password: hashedPassword,
          phone: celular,
        });
        console.log(`User with ID ${id} created successfully.`);
      } else {
        console.log(`User with ID ${id} already exists. Skipping.`);
      }
    } catch (error) {
      console.error(`Error processing user with ID ${id}:`, error);
    }
  }

  public async updateUsersDbWithGestao(): Promise<void> {
    try {
      const totalPages = await this.fetchTotalPages();
      for (let page = 1; page <= totalPages; page++) {
        console.log(`Processing page ${page} of ${totalPages}`);
        const users = await this.fetchUsersByPage(page);

        const userPromises = users.map((user) => this.processUser(user));
        await Promise.all(userPromises);
      }
      console.log("User database update completed successfully.");
    } catch (error) {
      console.error("Error updating user database:", error);
    }
  }
}

AppDataSource.initialize()
  .then(async () => {
    (async () => {
      const updater = new UserUpdater();
      await updater.updateUsersDbWithGestao();
    })();
  })
  .catch((error) => {
    console.error("Erro durante a inicialização do Data Source:", error);
  });
