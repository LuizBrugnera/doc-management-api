import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { ServiceDataService } from "../services/ServiceDataService";
import { AppDataSource } from "../data-source";

dotenv.config();

class ServiceDataUpdater {
  private API_URL: string;
  private API_TOKEN: string;
  private API_SECRET: string;
  private serviceDataService: ServiceDataService;
  private logFile: string;

  constructor() {
    this.API_URL = "https://api.beteltecnologia.com/servicos/?pagina=";
    this.API_TOKEN = process.env.API_GESTAO_TOKEN || "";
    this.API_SECRET = process.env.API_GESTAO_SECRET || "";
    this.serviceDataService = new ServiceDataService();
    this.logFile = "service_data_update.log";
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

  private async fetchServiceDataByPage(page: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.API_URL}${page}`, {
        headers: {
          "access-token": this.API_TOKEN,
          "secret-access-token": this.API_SECRET,
        },
      });
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching service data on page ${page}:`, error);
      return [];
    }
  }

  private async processServiceData(serviceData: any): Promise<void> {
    const { id, codigo, nome, valor_venda, observacoes } = serviceData;

    try {
      const serviceExists = await this.serviceDataService.getServiceDataByKey(
        "cod",
        codigo
      );

      if (!serviceExists) {
        await this.serviceDataService.createServiceData({
          id,
          cod: codigo,
          name: nome,
          sellValue: valor_venda,
          description: observacoes || null,
        });

        console.log(`ServiceData with code ${codigo} created successfully.`);
      } else {
        console.log(
          `ServiceData with code ${codigo} already exists. Skipping.`
        );
      }
    } catch (error) {
      console.error(`Error processing ServiceData with code ${codigo}:`, error);
      this.logErrorToFile(
        `Error processing ServiceData with code ${codigo}: ${error}`
      );
    }
  }

  public async updateServiceDataDbWithGestao(): Promise<void> {
    try {
      const totalPages = await this.fetchTotalPages();
      for (let page = 1; page <= totalPages; page++) {
        console.log(`Processing page ${page} of ${totalPages}`);
        const serviceDataList = await this.fetchServiceDataByPage(page);

        const serviceDataPromises = serviceDataList.map((serviceData) =>
          this.processServiceData(serviceData)
        );
        await Promise.all(serviceDataPromises);
      }
      console.log("ServiceData database update completed successfully.");
    } catch (error) {
      console.error("Error updating ServiceData database:", error);
    }
  }
}

AppDataSource.initialize()
  .then(async () => {
    (async () => {
      const updater = new ServiceDataUpdater();
      await updater.updateServiceDataDbWithGestao();
    })();
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
