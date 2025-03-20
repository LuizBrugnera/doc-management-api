import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { OsService } from "../services/OsService";
import { ServiceService } from "../services/ServiceService";
import { AppDataSource } from "../data-source";

dotenv.config();

class OsUpdater {
  private API_URL: string;
  private API_TOKEN: string;
  private API_SECRET: string;
  private osService: OsService;
  private serviceService: ServiceService;
  private logFile: string;

  constructor() {
    this.API_URL =
      "https://api.beteltecnologia.com/ordens_servicos/?loja&pagina=";
    this.API_TOKEN = process.env.API_GESTAO_TOKEN || "";
    this.API_SECRET = process.env.API_GESTAO_SECRET || "";
    this.osService = new OsService();
    this.serviceService = new ServiceService();
    this.logFile = "os_update.log";
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

  private async fetchOsByPage(page: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_URL}${page}`, {
        headers: {
          "access-token": this.API_TOKEN,
          "secret-access-token": this.API_SECRET,
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching OS on page ${page}:`, error);
      return [];
    }
  }

  private async processOs(osData: any): Promise<void> {
    const {
      id,
      codigo,
      cliente_id,
      nome_cliente,
      vendedor_id,
      nome_vendedor,
      tecnico_id,
      nome_tecnico,
      data_entrada,
      data_saida,
      nome_situacao,
      valor_total,
      nome_loja,
      servicos,
      hash,
    } = osData;

    const storeToNumber: Record<string, string> = {
      "GODOY ASSESSORIA": "GA-",
      "BETEL TREIN": "BT-",
      LAPAMEDSEG: "LM-",
      SOUZASEG: "SZ-",
      "BETEL ASSES": "BA-",
    };

    try {
      const osExists = await this.osService.getOsByKey(
        "cod",
        storeToNumber[nome_loja] + storeToNumber[nome_loja] + codigo
      );

      if (
        !osExists &&
        nome_situacao !== "Em aberto" &&
        nome_situacao !== "Aguardando pagamento"
      ) {
        const createdOs = await this.osService.createOs({
          cod: storeToNumber[nome_loja] + codigo,
          clientId: cliente_id,
          clientName: nome_cliente,
          sellerId: vendedor_id,
          sellerName: nome_vendedor,
          technicalId: tecnico_id,
          technicalName: nome_tecnico,
          entryDate: data_entrada,
          exitDate: data_saida || null,
          situationName: nome_situacao,
          totalValue: valor_total,
          storeName: nome_loja,
          hash,
        });

        console.log(
          `OS with code ${
            storeToNumber[nome_loja] + codigo
          } created successfully.`
        );

        if (servicos && servicos.length > 0 && false) {
          for (const service of servicos) {
            const { id, nome_servico, quantidade, valor_total } =
              service.servico;
            await this.serviceService.createService({
              cod: id,
              os: createdOs,
              name: nome_servico,
              quantity: quantidade,
              totalValue: valor_total,
            });
          }
          console.log(
            `Services for OS code ${
              storeToNumber[nome_loja] + codigo
            } processed successfully.`
          );
        }
      } else {
        console.log(
          `OS with code ${
            storeToNumber[nome_loja] + codigo
          } already exists. Skipping.`
        );
        if (osExists) {
          if (
            (osExists.situationName === "cliente protestado" ||
              osExists.situationName === "Faturado renovado" ||
              osExists.situationName === "Contrato renovado" ||
              osExists.situationName === "Contrato não renovado" ||
              osExists.situationName === "Contrato vencido" ||
              osExists.situationName === "Contrato cancelado" ||
              osExists.situationName === "Cancelado" ||
              osExists.situationName === "Em processo de Renovação" ||
              osExists.situationName === "Faturamento" ||
              osExists.situationName === "Concluído" ||
              osExists.situationName === "Enviando laudos p/ cliente") &&
            osExists.status === "pending"
          ) {
            await this.osService.updateOs(osExists.id, {
              status: "free-from-gestao",
            });
          }
        }
      }
    } catch (error) {
      console.error(
        `Error processing OS with code ${storeToNumber[nome_loja] + codigo}:`,
        error
      );
      this.logErrorToFile(
        `Error processing OS with code ${
          storeToNumber[nome_loja] + codigo
        }: ${error}`
      );
    }
  }

  public async updateOsDbWithGestao(): Promise<void> {
    try {
      const totalPages = await this.fetchTotalPages();
      for (let page = 1; page <= totalPages; page++) {
        console.log(`Processing page ${page} of ${totalPages}`);
        const osList = await this.fetchOsByPage(page);

        const osPromises = osList.map((os) => this.processOs(os));
        await Promise.all(osPromises);
      }
      console.log("OS database update completed successfully.");
    } catch (error) {
      console.error("Error updating OS database:", error);
    }
  }
}

AppDataSource.initialize()
  .then(async () => {
    (async () => {
      const updater = new OsUpdater();
      await updater.updateOsDbWithGestao();
    })();
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
