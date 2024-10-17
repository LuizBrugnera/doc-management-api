import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { DocumentService } from "../services/DocumentService";
import { NotificationService } from "../services/NotificationService";
import { LogService } from "../services/LogService";
import { formatDateToDDMMYYYY, formatDateToMySQL } from "../util/globalUtil";
import { UserService } from "../services/UserService";
import { DepartmentService } from "../services/DepartmentService";
import { AdminService } from "../services/AdminService";
import { AdminLogService } from "../services/AdminLogService";
import { Document } from "typeorm";

export class DocumentController {
  private userService = new UserService();
  private departmentService = new DepartmentService();
  private adminService = new AdminService();
  private documentService = new DocumentService();
  private notificationService = new NotificationService();
  private logService = new LogService();
  private adminLogService = new AdminLogService();

  private static readonly folderNames = [
    "boletos",
    "notasFiscais",
    "recibos",
    "laudosPCMSO",
    "laudosPGR",
    "laudosLTCAT",
    "laudosDiversos",
    "relatorioFaturamento",
    "relatorioEventoS2240",
    "relatorioEventoS2220",
    "relatorioEventoS2210",
    "contratos",
    "ordensServico",
  ];

  private static readonly folderDisplayNames: { [key: string]: string } = {
    boletos: "Boletos",
    notasFiscais: "Notas Fiscais",
    recibos: "Recibos",
    laudosPCMSO: "Laudos PCMSO",
    laudosPGR: "Laudos PGR",
    laudosLTCAT: "Laudos LTCAT",
    laudosDiversos: "Laudos Diversos",
    relatorioFaturamento: "Relatório de Faturamento",
    relatorioEventoS2240: "Relatório Evento S-2240",
    relatorioEventoS2220: "Relatório Evento S-2220",
    relatorioEventoS2210: "Relatório Evento S-2210",
    contratos: "Contratos",
    ordensServico: "Ordens de Serviço",
  };

  private static readonly folderShortNames: { [key: string]: string } = {
    boletos: "Boleto",
    notasFiscais: "Nota Fiscal",
    recibos: "Recibo",
    laudosPCMSO: "Laudo PCMSO",
    laudosPGR: "Laudo PGR",
    laudosLTCAT: "Laudo LTCAT",
    laudosDiversos: "Laudo Diverso",
    relatorioFaturamento: "Faturamento",
    relatorioEventoS2240: "Evento S-2240",
    relatorioEventoS2220: "Evento S-2220",
    relatorioEventoS2210: "Evento S-2210",
    contratos: "Contrato",
    ordensServico: "Ordem de Serviço",
  };

  private static readonly folderStructure = [
    {
      name: "Financeiro",
      contents: [
        { name: "Boletos", resource: "folder", contents: [] },
        { name: "Notas Fiscais", resource: "folder", contents: [] },
        { name: "Recibos", resource: "folder", contents: [] },
      ],
    },
    {
      name: "Documentos Técnicos",
      contents: [
        { name: "Laudos PCMSO", resource: "folder", contents: [] },
        { name: "Laudos PGR", resource: "folder", contents: [] },
        { name: "Laudos LTCAT", resource: "folder", contents: [] },
        { name: "Laudos Diversos", resource: "folder", contents: [] },
      ],
    },
    {
      name: "Exames",
      contents: [
        { name: "Exames Laboratoriais", resource: "folder", contents: [] },
        { name: "Exames Telecardio", resource: "folder", contents: [] },
        { name: "Exames Local", resource: "folder", contents: [] },
        {
          name: "Exames Proclinic (Audiometria)",
          resource: "folder",
          contents: [],
        },
        {
          name: "Exames Proclinic (Aso)",
          resource: "folder",
          contents: [],
        },
      ],
    },
    {
      name: "Faturamento",
      contents: [
        {
          name: "Relatório de Faturamento",
          resource: "folder",
          contents: [],
        },
      ],
    },
    {
      name: "E-social",
      contents: [
        { name: "Relatório Evento S-2240", resource: "folder", contents: [] },
        { name: "Relatório Evento S-2220", resource: "folder", contents: [] },
        { name: "Relatório Evento S-2210", resource: "folder", contents: [] },
      ],
    },
    {
      name: "Vendas",
      contents: [
        { name: "Contratos", resource: "folder", contents: [] },
        { name: "Ordens de Serviço", resource: "folder", contents: [] },
      ],
    },
  ];

  private handleError(res: Response, error: any, message: string): void {
    console.error(error);
    res.status(500).json({ message });
  }

  private getUserId(req: Request): number | null {
    const userId = req.user?.id;
    if (!userId) {
      return null;
    }
    return userId;
  }

  private isAuthorized(userId: number, document: any, req: Request): boolean {
    return (
      document.userId === userId ||
      req.user?.role === "admin" ||
      (req.user?.role === "department" &&
        req.user?.department === document.department)
    );
  }

  private getFolderKeyByDisplayName(displayName: string): string | undefined {
    return Object.keys(DocumentController.folderDisplayNames).find(
      (key) => DocumentController.folderDisplayNames[key] === displayName
    );
  }

  private insertDocumentsIntoStructure(
    folderName: string,
    docs: any[],
    structure: any[]
  ): boolean {
    for (const folder of structure) {
      if (folder.contents) {
        for (const content of folder.contents) {
          if (
            content.name === DocumentController.folderDisplayNames[folderName]
          ) {
            content.contents = docs;
            return true;
          } else if (
            content.contents.length > 0 &&
            content.resource === "folder"
          ) {
            if (
              this.insertDocumentsIntoStructure(
                folderName,
                docs,
                content.contents
              )
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  private assignLogToUser = async ({
    userId,
    date,
    role,
    action,
    description,
    state,
  }: {
    userId: number;
    date: Date;
    role: string;
    action: string;
    description: string;
    state: string;
  }) => {
    try {
      if (role === "department") {
        const department = await this.departmentService.getDepartmentById(
          userId
        );
        if (!department) {
          return null;
        }
        await this.logService.createLog({
          action,
          description,
          department,
          date,
          state,
        });
      } else if (role === "admin") {
        const admin = await this.adminService.getAdminById(userId);
        if (!admin) {
          return null;
        }
        await this.adminLogService.createAdminLog({
          action,
          description,
          date,
          state,
          admin,
        });
      }
    } catch (error) {
      return null;
    }
  };

  public getAllDocuments = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const documents = await this.documentService.getAllDocuments();
      res.json(documents);
    } catch (error: any) {
      this.handleError(res, error, error.message);
    }
  };

  public getDocumentById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const document = await this.documentService.getDocumentById(id);
      if (!document) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }
      res.json(document);
    } catch (error: any) {
      this.handleError(res, error, error.message);
    }
  };

  public createDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const documentData = req.body;
      const document = await this.documentService.createDocument(documentData);
      res.status(201).json(document);
    } catch (error: any) {
      this.handleError(res, error, error.message);
    }
  };

  public updateDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const documentData = req.body;
      const document = await this.documentService.updateDocument(
        id,
        documentData
      );
      if (!document) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }
      res.json(document);
    } catch (error: any) {
      this.handleError(res, error, error.message);
    }
  };

  public deleteDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const documentId = parseInt(req.params.documentId);
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      const document = await this.documentService.getDocumentById(documentId);

      if (!document) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      const hasPermission = this.isAuthorized(userId, document, req);

      if (!hasPermission) {
        res.status(403).json({ message: "Usuário não autorizado" });
        return;
      }

      const filePath = path.join(
        __dirname,
        `../../documents/${document.user.id}/${document.uuid}`
      );

      try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        await fs.promises.unlink(filePath);
        console.log(`Arquivo ${filePath} excluído com sucesso.`);
      } catch (err) {
        console.error(`Erro ao excluir o arquivo ${filePath}:`, err);
        throw new Error("Erro ao excluir o arquivo");
      }

      const success = await this.documentService.deleteDocument(documentId);

      if (!success) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      if (req.user?.role !== "user") {
        await this.assignLogToUser({
          userId,
          date: new Date(),
          role: "department",
          action: "Documento excluído",
          description: `Documento ${documentId} excluído com sucesso`,
          state: "success",
        });
      }

      res.json({ message: "Documento deletado com sucesso" });
    } catch (error: any) {
      this.handleError(res, error, "Erro ao excluir documento");
    }
  };

  public downloadDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId =
        req.user?.role === "user"
          ? this.getUserId(req)
          : parseInt(req.params.userId);
      const documentId = parseInt(req.params.documentId);

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      const document = await this.documentService.getDocumentById(documentId);
      if (!document) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      const type = path.extname(document.uuid);
      const filePath = path.join(
        __dirname,
        `../../documents/${document.user.id}/${document.uuid}`
      );

      try {
        await fs.promises.access(filePath, fs.constants.F_OK);
      } catch (err) {
        res.status(404).json({ message: "Arquivo não encontrado" });
        return;
      }

      const mimeType =
        mime.lookup(`${document.name}${type}`) || "application/octet-stream";

      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${document.name}${type}"`
      );

      res.sendFile(filePath);
    } catch (error: any) {
      this.handleError(res, error, "Erro ao baixar documento");
    }
  };

  public uploadDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const { name, type, description, folder } = req.body;
      const file = req.file;
      const uuid = req.uuidFile;

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      if (!file || !uuid) {
        res
          .status(400)
          .json({ message: "Nenhum arquivo enviado ou UUID ausente" });
        return;
      }

      const date = new Date();

      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      await this.documentService.createDocument({
        name,
        type,
        description,
        date,
        user,
        uuid,
        folder,
      });

      await this.notificationService.createNotification({
        title: "Novo documento disponível",
        user,
        description: `Novo documento ${name} recebido e pronto para download`,
      });

      this.assignLogToUser({
        userId,
        date,
        role: "department",
        action: "Documento adicionado",
        description: `Novo documento ${name} adicionado e pronto para download`,
        state: "success",
      });

      res.status(200).json({
        message: `Arquivo ${file.originalname} salvo com sucesso para o usuário ${userId}`,
      });
    } catch (error: any) {
      this.handleError(res, error, "Erro ao fazer upload do arquivo");
    }
  };

  public getDocumentsByUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      const documents = await this.documentService.getDocumentsByUserId(userId);
      res.status(200).json(documents);
    } catch (error: any) {
      this.handleError(res, error, "Erro ao buscar documentos");
    }
  };

  public getDocumentsByFolder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const folderAccess = req.user?.folderAccess;

      if (!folderAccess) {
        res.status(400).json({ message: "Acessos não encontrados" });
        return;
      }

      const documents = await Promise.all(
        folderAccess.map(async (folder) => {
          return this.documentService.getDocumentsByFolder(folder.foldername);
        })
      );

      const flattenedDocuments = documents.flat();

      res.status(200).json(flattenedDocuments);
    } catch (error: any) {
      this.handleError(res, error, "Erro ao buscar documentos");
    }
  };
  /*
  public getDocumentsByUserIdAndFolder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const folder = req.params.folder;

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      const documents =
        await this.documentService.getDocumentsByUserIdAndFolder(
          userId,
          folder
        );
      res.status(200).json(documents);
    } catch (error: any) {
      this.handleError(res, error, "Erro ao buscar documentos");
    }
  };
*/
  public getDocumentsByUserIdInFolderFormat = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      const folderStructureCopy = JSON.parse(
        JSON.stringify(DocumentController.folderStructure)
      );

      const documentsByFolder = await Promise.all(
        DocumentController.folderNames.map(async (folder) => {
          const docs = await this.documentService.getDocumentsByUserIdAndFolder(
            userId,
            folder
          );
          return { folder, docs };
        })
      );

      documentsByFolder.forEach(({ folder, docs }) => {
        this.insertDocumentsIntoStructure(folder, docs, folderStructureCopy);
      });

      res.status(200).json(folderStructureCopy);
    } catch (error: any) {
      this.handleError(res, error, "Erro ao buscar documentos");
    }
  };

  public autoAssignUploadDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { name, type, description, folder } = req.body;
      const file = req.file;
      const uuid = req.uuidFile;
      const userId = req.documentUserId;

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      if (!file || !uuid) {
        res
          .status(400)
          .json({ message: "Nenhum arquivo enviado ou UUID ausente" });
        return;
      }

      const folderKey = this.getFolderKeyByDisplayName(folder);

      if (!folderKey) {
        res.status(400).json({ message: "Pasta inválida" });
        return;
      }

      const date = new Date();
      const formattedDate = formatDateToDDMMYYYY(formatDateToMySQL(date));

      const documentName = `${
        DocumentController.folderShortNames[folderKey]
      } - ${name.split(".")[0]} - ${formattedDate}.${type}`;

      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      await this.documentService.createDocument({
        name: documentName,
        type,
        description,
        date,
        user,
        uuid,
        folder: folderKey,
      });

      await this.notificationService.createNotification({
        title: "Novo documento disponível",
        user,
        description: `Novo documento ${name} na pasta ${folder} recebido e pronto para download`,
      });

      if (req.user?.id && req.user.role) {
        this.assignLogToUser({
          userId: req.user.id,
          action: "Documento adicionado",
          date: new Date(),
          description: `Novo documento ${name} na pasta ${folder} adicionado e pronto para download`,
          role: req.user.role,
          state: "",
        });
      }
      res.status(200).json({
        message: `Arquivo ${file.originalname} salvo com sucesso para o usuário ${userId}`,
      });
    } catch (error: any) {
      this.handleError(res, error, "Erro ao fazer upload do arquivo");
    }
  };
}
