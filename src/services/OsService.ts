import { AppDataSource } from "../data-source";
import { Os } from "../entities/Os";
import { ServiceData } from "../entities/ServiceData";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { User } from "../entities/User";
import { Document } from "../entities/Document";
import { ServiceService } from "./ServiceService";
import { In } from "typeorm";
import { OsHistoricService } from "./OsHistoricService";
dotenv.config();

export class OsService {
  private osRepository = AppDataSource.getRepository(Os);
  private serviceService = new ServiceService();
  private serviceDataRepository = AppDataSource.getRepository(ServiceData);
  private documentRepository = AppDataSource.getRepository(Document);
  private osHistoricService = new OsHistoricService();
  private API_URL =
    "https://api.beteltecnologia.com/ordens_servicos/?loja&pagina=";
  private API_TOKEN = process.env.API_GESTAO_TOKEN || "";
  private API_SECRET = process.env.API_GESTAO_SECRET || "";
  private logFile = "os_update.log";
  private storeToNumber: Record<string, string> = {
    "GODOY ASSESSORIA": "GA-",
    "BETEL TREIN": "BT-",
    LAPAMEDSEG: "LM-",
    SOUZASEG: "SZ-",
    "BETEL ASSES": "BA-",
  };

  private logErrorToFile(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFile(this.logFile, logMessage, (err) => {
      if (err) {
      }
    });
  }

  public async fixTheDocumentsToOs() {
    const allDocuments = await this.documentRepository.find({
      where: { isInvisible: false },
      relations: ["user"],
    });

    for (const document of allDocuments) {
      const os = await this.osRepository.findOne({
        where: { clientId: document.user.cod },
      });

      if (!os || document.folder !== "ordensServico") {
        continue;
      }

      if (os.status === "done_delivered") {
        await this.osRepository.update(os.id, {
          documentosOs: os.documentosOs
            ? os.documentosOs + "," + document.id
            : document.id.toString(),
        });
      }
    }
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

  private addOneDay(date: Date): Date {
    return new Date(date.getTime() + 24 * 60 * 60 * 1000);
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

    if (nome_cliente === "PETRIM ODONTOLOGIA LTDA") {
      console.log("++---------------------------++");
      console.log(osData);
    }
    if (nome_cliente === "TRIANGULO MOBILIARIO LTDA") {
      console.log("++---------------------------++");
      console.log(osData);
    }
    if (
      nome_cliente ===
      "IMPACTTY TRATAMENTO DE CONCRETO E PINTURAS EM GERAL LTDA"
    ) {
      console.log("++---------------------------++");
      console.log(osData);
    }
    if (nome_cliente === "GASTRONOMIA DOIS IRMAOS LTDA") {
      console.log("++---------------------------++");
      console.log(osData);
    }
    if (nome_cliente === "RODRIGO BEZERRA DO NASCIMENTO 31299171877") {
      console.log("++---------------------------++");
      console.log(osData);
    }
    try {
      const osExists = await this.getOsByKey(
        "cod",
        this.storeToNumber[nome_loja] + codigo
      );
      if (nome_cliente === "PETRIM ODONTOLOGIA LTDA") {
        console.log("--------------------");
        console.log(osExists);
      }
      if (nome_cliente === "TRIANGULO MOBILIARIO LTDA") {
        console.log("--------------------");
        console.log(osExists);
      }
      if (
        nome_cliente ===
        "IMPACTTY TRATAMENTO DE CONCRETO E PINTURAS EM GERAL LTDA"
      ) {
        console.log("--------------------");
        console.log(osExists);
      }
      if (nome_cliente === "GASTRONOMIA DOIS IRMAOS LTDA") {
        console.log("--------------------");
        console.log(osExists);
      }
      if (nome_cliente === "RODRIGO BEZERRA DO NASCIMENTO 31299171877") {
        console.log("--------------------");
        console.log(osExists);
      }
      if (
        !osExists &&
        nome_situacao !== "Em aberto" &&
        nome_situacao !== "Aguardando pagamento"
      ) {
        if (nome_cliente === "PETRIM ODONTOLOGIA LTDA") {
          console.log("Criando");
          console.log("++---------------------------++");
        }
        if (nome_cliente === "TRIANGULO MOBILIARIO LTDA") {
          console.log("Criando");
          console.log("++---------------------------++");
        }
        if (
          nome_cliente ===
          "IMPACTTY TRATAMENTO DE CONCRETO E PINTURAS EM GERAL LTDA"
        ) {
          console.log("Criando");
          console.log("++---------------------------++");
        }
        if (nome_cliente === "GASTRONOMIA DOIS IRMAOS LTDA") {
          console.log("Criando");
          console.log("++---------------------------++");
        }
        if (nome_cliente === "RODRIGO BEZERRA DO NASCIMENTO 31299171877") {
          console.log("Criando");
          console.log("++---------------------------++");
        }
        const createdOs = await this.createOs({
          cod: this.storeToNumber[nome_loja] + codigo,
          clientId: cliente_id,
          clientName: nome_cliente,
          sellerId: vendedor_id,
          sellerName: nome_vendedor,
          technicalId: tecnico_id,
          technicalName: nome_tecnico,
          exitDate: data_saida
            ? this.addOneDay(new Date(data_saida))
            : undefined,
          entryDate: new Date(
            data_entrada ? this.addOneDay(new Date(data_entrada)) : data_entrada
          ),
          situationName: nome_situacao,
          totalValue: valor_total,
          storeName: nome_loja,
          hash,
        });

        if (servicos && servicos.length > 0) {
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
        }
      } else if (osExists) {
        if (
          (nome_situacao === "cliente protestado" ||
            nome_situacao === "Faturado renovado" ||
            nome_situacao === "Contrato renovado" ||
            nome_situacao === "Contrato não renovado" ||
            nome_situacao === "Contrato vencido" ||
            nome_situacao === "Contrato cancelado" ||
            nome_situacao === "Cancelado" ||
            nome_situacao === "Em processo de Renovação" ||
            nome_situacao === "Faturamento" ||
            nome_situacao === "Concluído" ||
            nome_situacao === "Alterar dados" ||
            nome_situacao === "Laudos assinados" ||
            nome_situacao === "Enviando laudos p/ cliente") &&
          osExists.status === "pending"
        ) {
          if (nome_cliente === "PETRIM ODONTOLOGIA LTDA") {
            console.log("Entrou na primeira atualizacao");
            console.log("++---------------------------++");
          }
          if (nome_cliente === "TRIANGULO MOBILIARIO LTDA") {
            console.log("Entrou na primeira atualizacao");
            console.log("++---------------------------++");
          }
          if (
            nome_cliente ===
            "IMPACTTY TRATAMENTO DE CONCRETO E PINTURAS EM GERAL LTDA"
          ) {
            console.log("Entrou na primeira atualizacao");
            console.log("++---------------------------++");
          }
          if (nome_cliente === "GASTRONOMIA DOIS IRMAOS LTDA") {
            console.log("Entrou na primeira atualizacao");
            console.log("++---------------------------++");
          }
          if (nome_cliente === "RODRIGO BEZERRA DO NASCIMENTO 31299171877") {
            console.log("Entrou na primeira atualizacao");
            console.log("++---------------------------++");
          }
          await this.updateOs(osExists.id, {
            status: "free-from-gestao",
            situationName: nome_situacao,
            exitDate: data_saida
              ? this.addOneDay(new Date(data_saida))
              : undefined,
            entryDate: data_entrada
              ? this.addOneDay(new Date(data_entrada))
              : data_entrada,
          });
        } else {
          if (nome_cliente === "PETRIM ODONTOLOGIA LTDA") {
            console.log("Entrou na segunda atualizacao");
            console.log("++---------------------------++");
          }
          if (nome_cliente === "TRIANGULO MOBILIARIO LTDA") {
            console.log("Entrou na segunda atualizacao");
            console.log("++---------------------------++");
          }
          if (
            nome_cliente ===
            "IMPACTTY TRATAMENTO DE CONCRETO E PINTURAS EM GERAL LTDA"
          ) {
            console.log("Entrou na segunda atualizacao");
            console.log("++---------------------------++");
          }
          if (nome_cliente === "GASTRONOMIA DOIS IRMAOS LTDA") {
            console.log("Entrou na segunda atualizacao");
            console.log("++---------------------------++");
          }
          if (nome_cliente === "RODRIGO BEZERRA DO NASCIMENTO 31299171877") {
            console.log("Entrou na segunda atualizacao");
            console.log("++---------------------------++");
          }
          await this.updateOs(osExists.id, {
            situationName: nome_situacao,
            exitDate: data_saida
              ? this.addOneDay(new Date(data_saida))
              : undefined,
            entryDate: data_entrada
              ? this.addOneDay(new Date(data_entrada))
              : data_entrada,
          });
        }
      }
    } catch (error) {
      this.logErrorToFile(
        `Error processing OS with code ${
          this.storeToNumber[nome_loja] + codigo
        }: ${error}`
      );
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

  async getAllOss(): Promise<any[]> {
    // 1. Busca das OS com os joins usuais
    const oss = await this.osRepository
      .createQueryBuilder("os")
      .leftJoinAndSelect("os.services", "services")
      .leftJoinAndSelect("os.osHistoric", "osHistoric")
      .leftJoinAndSelect("os.assignedDocument", "assignedDocument")
      .where("os.situationName NOT IN (:...excluded)", {
        excluded: ["Em aberto", "Aguardando pagamento"],
      })
      .getMany();

    // 2. Coleta de TODOS os IDs de documentos referenciados
    const allDocIds = new Set<number>();
    oss.forEach(({ documentosOs }) => {
      documentosOs
        ?.split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n))
        .forEach((n) => allDocIds.add(n));
    });

    // 3. Busca de todos os documentos em um único hit
    let docMap = new Map<number, Document>();
    if (allDocIds.size) {
      const docs = await this.documentRepository.find({
        where: { id: In([...allDocIds]) },
      });
      docMap = new Map(docs.map((d) => [d.id, d]));
    }

    // 4. Monta o retorno, substituindo pelos objetos
    return oss.map((os) => {
      const ids = os.documentosOs
        ? os.documentosOs
            .split(",")
            .map((s) => Number(s.trim()))
            .filter((n) => !Number.isNaN(n))
        : [];

      return {
        ...os,
        documents: ids.map((id) => id.toString()).filter(Boolean),
      };
    });
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
