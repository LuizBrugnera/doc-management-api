import { AppDataSource } from "../data-source";
import { Os } from "../entities/Os";
import { ServiceData } from "../entities/ServiceData";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { User } from "../entities/User";
import { Document } from "../entities/Document";
dotenv.config();

export class OsService {
  private osRepository = AppDataSource.getRepository(Os);
  private serviceDataRepository = AppDataSource.getRepository(ServiceData);
  private API_URL =
    "https://api.beteltecnologia.com/ordens_servicos/?loja&pagina=";
  private API_TOKEN = process.env.API_GESTAO_TOKEN || "";
  private API_SECRET = process.env.API_GESTAO_SECRET || "";
  private logFile = "os_update.log";

  private logErrorToFile(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFile(this.logFile, logMessage, (err) => {
      if (err) {
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

    try {
      const osExists = await this.getOsByKey("cod", codigo);

      if (
        !osExists &&
        nome_situacao !== "Em aberto" &&
        nome_situacao !== "Aguardando pagamento"
      ) {
        await this.createOs({
          cod: codigo,
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
      } else if (osExists) {
        await this.updateOs(osExists.id, {
          situationName: nome_situacao,
        });
      }
    } catch (error) {
      this.logErrorToFile(`Error processing OS with code ${codigo}: ${error}`);
    }
  }

  public async updateOsDbWithGestao(): Promise<void> {
    try {
      const totalPages = await this.fetchTotalPages();
      for (let page = 1; page <= totalPages; page++) {
        const osList = await this.fetchOsByPage(page);

        const osPromises = osList.map((os) => this.processOs(os));
        await Promise.all(osPromises);
      }
    } catch (error) {}
  }

  async updateOsWithServices(): Promise<void> {
    const allOs = await this.osRepository.find({ relations: ["services"] });
    const allServices = await this.serviceDataRepository.find();

    // Criar um Map para acesso rápido ao tipo do serviço
    const serviceMap = new Map<string, string>(
      allServices.map((service) => [service.name, service.type])
    );

    // Filtrar e atualizar apenas as OS que têm correspondência
    const updatedOs = allOs
      .map((os) => {
        // Obter todos os tipos correspondentes aos services desta OS
        const matchedTypes = new Set(
          os.services
            .map((s) => serviceMap.get(s.name)) // pegar o type pelo nome do service
            .filter(Boolean) // filtrar undefined
        );

        // Se não há nenhum tipo correspondido, retornar null (não atualiza)
        if (matchedTypes.size === 0) {
          return null;
        }

        // Se há exatamente 1 tipo
        if (matchedTypes.size === 1) {
          const [type] = matchedTypes;
          if (type === "page") {
            os.type = "page";
          } else if (type === "any") {
            os.type = "any";
          } else if (type === "training") {
            os.type = "training";
          } else {
            return null; // Se for algo fora do esperado
          }
        }
        // Se há exatamente 2 tipos
        else if (matchedTypes.size === 2) {
          if (matchedTypes.has("page") && matchedTypes.has("any")) {
            os.type = "page-any";
          } else if (matchedTypes.has("page") && matchedTypes.has("training")) {
            os.type = "page-training";
          } else if (matchedTypes.has("any") && matchedTypes.has("training")) {
            os.type = "any-training";
          } else {
            return null;
          }
        }
        // Se há exatamente 3 tipos, verificar se são os três esperados
        else if (matchedTypes.size === 3) {
          if (
            matchedTypes.has("page") &&
            matchedTypes.has("any") &&
            matchedTypes.has("training")
          ) {
            os.type = "page-any-training";
          } else {
            return null; // Se tiver algum outro tipo além desses, não atualiza
          }
        }
        // Caso tenha 4 ou mais tipos, não atualiza (ou ajuste se quiser outro comportamento)
        else {
          return null;
        }

        // Retorna a OS atualizada
        return os;
      })
      .filter((os): os is Os => os !== null); // Remover valores nulos e garantir tipagem correta

    if (updatedOs.length > 0) {
      await this.osRepository.save(updatedOs);
    }
  }

  async getAllOss(): Promise<Os[]> {
    const oss = await this.osRepository
      .createQueryBuilder("os")
      .leftJoinAndSelect("os.services", "services")
      .getMany();

    const documents = await this.osRepository
      .createQueryBuilder("os")
      .leftJoin(User, "user", "user.name = os.clientName")
      .leftJoin(Document, "document", "document.user_id = user.id")
      .select(["os.id AS os_id", "GROUP_CONCAT(document.id) AS documents"])
      .groupBy("os.id")
      .getRawMany();

    const documentMap = new Map<number, number[]>();
    documents.forEach((doc) => {
      documentMap.set(
        doc.os_id,
        doc.documents ? doc.documents.split(",").map(Number) : []
      );
    });

    return oss.map((os) => ({
      ...os,
      documents: documentMap.get(os.id) || [],
    }));
  }

  async getOsById(id: number): Promise<Os | null> {
    return await this.osRepository.findOne({
      where: { id },
      relations: ["services"],
    });
  }

  async createOs(osData: Partial<Os>): Promise<Os> {
    const os = this.osRepository.create(osData);
    return await this.osRepository.save(os);
  }
  async getOsByKey(key: string, value: string): Promise<Os | null> {
    return await this.osRepository.findOne({
      where: { [key]: value },
    });
  }

  async getAllOssByName(name: string): Promise<Os[]> {
    return await this.osRepository.find({
      where: { clientName: name },
      relations: ["services"],
    });
  }

  async updateOs(id: number, osData: Partial<Os>): Promise<Os | null> {
    const os = await this.osRepository.findOneBy({ id });
    if (!os) {
      return null;
    }
    this.osRepository.merge(os, osData);
    return await this.osRepository.save(os);
  }

  async deleteOs(id: number): Promise<boolean> {
    const result = await this.osRepository.delete(id);
    return result.affected !== 0;
  }
}
