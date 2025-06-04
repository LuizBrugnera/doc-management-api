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
import { FolderAccessService } from "../services/FolderAccessService";
import { EmailHelper } from "../helper/EmailHelper";
import {
  sendDocumentsMailDinamicTemplateOptions,
  sendDocumentsMailOptions,
} from "../helper/EmailData";
import { Log } from "../entities/Log";
import { EmailUserDepartmentService } from "../services/EmailUserDepartmentService";
import { EmailTemplateService } from "../services/EmailTemplateService";
import { documentCache } from "../cache/documentCache";

export class DocumentController {
  private userService = new UserService();
  private departmentService = new DepartmentService();
  private adminService = new AdminService();
  private documentService = new DocumentService();
  private notificationService = new NotificationService();
  private logService = new LogService();
  private adminLogService = new AdminLogService();
  private folderAccessService = new FolderAccessService();
  private emailUserDepartmentService = new EmailUserDepartmentService();
  private emailTemplateService = new EmailTemplateService();

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

  private isAuthorized(userId: number, document: any, req: Request) {
    return (
      document.userId === userId ||
      req.user?.role === "admin" ||
      (req.user?.role === "department" &&
        req.user.folderAccess?.some(
          (folder) => folder.foldername === document.folder
        ))
    );
  }

  private getFolderKeyByDisplayName(displayName: string): string | undefined {
    return Object.keys(DocumentController.folderDisplayNames).find(
      (key) => DocumentController.folderDisplayNames[key] === displayName
    );
  }

  private getFiveRandomNumbers(): number[] {
    const numeros = [];
    for (let i = 0; i < 5; i++) {
      const numeroAleatorio = Math.floor(Math.random() * 10); // Gera números entre 0 e 9
      numeros.push(numeroAleatorio);
    }
    return numeros;
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

  private getLogToUser = async (logId: number, role: string) => {
    if (role === "department") {
      const log = await this.logService.getLogById(logId);
      return log;
    } else if (role === "admin") {
      const log = await this.adminLogService.getAdminLogById(logId);
      return log;
    }
    return null;
  };

  private getDepOrAdminById = async (id: number, role: string) => {
    if (role === "department") {
      const department = await this.departmentService.getDepartmentById(id);
      if (!department) {
        return null;
      }
      return department;
    } else if (role === "admin") {
      const admin = await this.adminService.getAdminById(id);
      if (!admin) {
        return null;
      }
      return admin;
    }
    return null;
  };

  private updateLogToUser = async (
    logId: number,
    role: string,
    logData: Partial<Log>
  ) => {
    if (role === "department") {
      const log = await this.logService.getLogById(logId);
      if (!log) {
        return null;
      }
      const newLog = { ...log, ...logData };
      const updatedLog = await this.logService.updateLog(logId, newLog);
      return updatedLog;
    } else if (role === "admin") {
      const log = await this.adminLogService.getAdminLogById(logId);
      if (!log) {
        return null;
      }
      const newLog = { ...log, ...logData };
      const updatedLog = await this.adminLogService.updateAdminLog(
        logId,
        newLog
      );
      return updatedLog;
    }
    return null;
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
      } catch (err) {
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

  private replacePlaceholders(
    template: string,
    values: Record<string, string>
  ): string {
    return template.replace(/\[(\w+)\]/g, (_, key) => values[key] || "");
  }

  public uploadDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);

      const {
        name,
        type,
        description,
        folder,
        templateId,
        hash,
        position,
        totalFiles,
        isInvisible,
      } = req.body;
      const file = req.file;
      const uuid = req.uuidFile;
      const notSendEmailNew = req.body.notSendEmail || "false";
      const notSendEmail = JSON.parse(notSendEmailNew);
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

      const documentCreated = await this.documentService.createDocument({
        name,
        type,
        description,
        date,
        user,
        uuid,
        folder,
        hash,
        position,
        totalFiles,
        isInvisible: !!isInvisible || false,
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

      let notSendEmail2 = false;

      if (
        documentCreated.position &&
        documentCreated.totalFiles &&
        documentCreated.hash
      ) {
        if (!Array.isArray(documentCache[documentCreated.hash])) {
          documentCache[documentCreated.hash] = [];
        }

        documentCache[documentCreated.hash].push({
          position: documentCreated.position,
          uuid: documentCreated.uuid,
          type: documentCreated.type,
          folder: documentCreated.folder,
        });

        if (
          +documentCreated.totalFiles !==
          +documentCache[documentCreated.hash].length
        ) {
          notSendEmail2 = true;
        } else if (
          +documentCache[documentCreated.hash].length ===
          +documentCreated.totalFiles
        ) {
          /// removendo o documento do cache
          delete documentCache[documentCreated.hash];

          const userEmails =
            await this.emailUserDepartmentService.getAssociationByUserId(
              user.id
            );

          const userEmailsText = userEmails
            .map((email) => email.email)
            .join(", ");
          try {
            const attachments = documentCache[documentCreated.hash].map(
              (file) => {
                return {
                  filename: `${file.folder}-${file.position}.${file.type}`,
                  content: fs.readFileSync(
                    path.join(
                      __dirname,
                      `../../documents/${user.id}/${file.uuid}`
                    )
                  ),
                };
              }
            );

            const formattedDate = formatDateToDDMMYYYY(formatDateToMySQL(date));
            const templateExists =
              await this.emailTemplateService.getEmailTemplateById(templateId);

            const values = {
              nome: user.name,
              email: user.mainEmail,
              cpf: user.cpf || "Não Informado",
              cnpj: user.cnpj || "Não Informado",
            };

            const template = templateExists?.content || "Olá,";

            const formattedTemplate = this.replacePlaceholders(
              template,
              values
            );

            const documentName = `${
              DocumentController.folderShortNames[folder]
            } - ${name.split(".")[0]} - ${formattedDate}.${type}`;

            EmailHelper.sendMail({
              to: userEmailsText
                ? user.mainEmail + "," + userEmailsText
                : user.mainEmail,
              subject: templateExists?.subject || "Documentos para download",
              text: sendDocumentsMailDinamicTemplateOptions.text(
                formattedTemplate
              ),
              html: sendDocumentsMailDinamicTemplateOptions.html(
                user.name,
                documentName,
                formattedTemplate.replace(/\n/g, "<br/>")
              ),
              attachments: attachments,
            }).then((result) => {
              if (req.user?.id && req.user.role) {
                if (result) {
                  this.assignLogToUser({
                    userId: req.user.id,
                    action: "Email enviado com Sucesso",
                    date: new Date(),
                    description: `Sucesso ao enviar o email para ${userEmailsText} com o documento ${documentName}`,
                    role: req.user.role,
                    state: "success",
                  });
                } else {
                  if (req.user?.id && req.user.role) {
                    this.assignLogToUser({
                      userId: req.user.id,
                      action: "Falha ao enviar o email",
                      date: new Date(),
                      description: `Falha ao enviar o email para o email ${userEmailsText},  usuario - ${user.name}, com o documento - ${documentName}, u ID{${user.id}} c ID {${documentCreated.id}}`,
                      role: req.user.role,
                      state: "failure",
                    });
                  }
                }
              }
            });
          } catch (error) {}
          res.status(200).json({
            id: documentCreated.id,
          });
          return;
        }
      }

      if (notSendEmail || notSendEmail2) {
        this.assignLogToUser({
          userId: req.user!.id,
          action: "Email não enviado",
          date: new Date(),
          description: `Email não enviado, por escolha do departamento ou administrador`,
          role: req.user!.role,
          state: "failure",
        });
        res.status(200).json({
          id: documentCreated.id,
        });
        return;
      }

      const userEmails =
        await this.emailUserDepartmentService.getAssociationByUserId(user.id);

      const userEmailsText = userEmails.map((email) => email.email).join(", ");
      try {
        const type = path.extname(uuid);
        const filePath = path.join(
          __dirname,
          `../../documents/${user.id}/${uuid}`
        );

        const pdfContent = fs.readFileSync(filePath);

        const depOrAdmin = await this.getDepOrAdminById(
          user.id,
          req.user?.role!
        );
        const formattedDate = formatDateToDDMMYYYY(formatDateToMySQL(date));
        const templateExists =
          await this.emailTemplateService.getEmailTemplateById(templateId);

        const values = {
          nome: user.name,
          email: user.mainEmail,
          cpf: user.cpf || "Não Informado",
          cnpj: user.cnpj || "Não Informado",
        };

        const template = templateExists?.content || "Olá,";

        const formattedTemplate = this.replacePlaceholders(template, values);

        const documentName = `${
          DocumentController.folderShortNames[folder]
        } - ${name.split(".")[0]} - ${formattedDate}.${type}`;

        EmailHelper.sendMail({
          to: userEmailsText
            ? user.mainEmail + "," + userEmailsText
            : user.mainEmail,
          subject: templateExists?.subject || "Documentos para download",
          text: sendDocumentsMailDinamicTemplateOptions.text(formattedTemplate),
          html: sendDocumentsMailDinamicTemplateOptions.html(
            user.name,
            documentName,
            formattedTemplate.replace(/\n/g, "<br/>")
          ),
          attachments: sendDocumentsMailOptions.attachments(
            folder,
            type,
            pdfContent
          ),
        }).then((result) => {
          if (req.user?.id && req.user.role) {
            if (result) {
              this.assignLogToUser({
                userId: req.user.id,
                action: "Email enviado com Sucesso",
                date: new Date(),
                description: `Sucesso ao enviar o email para ${userEmailsText} com o documento ${documentName}`,
                role: req.user.role,
                state: "success",
              });
            } else {
              if (req.user?.id && req.user.role) {
                this.assignLogToUser({
                  userId: req.user.id,
                  action: "Falha ao enviar o email",
                  date: new Date(),
                  description: `Falha ao enviar o email para o email ${userEmailsText},  usuario - ${user.name}, com o documento - ${documentName}, u ID{${user.id}} c ID {${documentCreated.id}}`,
                  role: req.user.role,
                  state: "failure",
                });
              }
            }
          }
        });
      } catch (error) {}
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
      const userId = req.user?.id;

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

  public getDocumentsByDepartmentFolderAccess = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const departmentId = req.user?.id;
      if (!departmentId) {
        res.status(400).json({ message: "Id do Departamento não encontrado" });
        return;
      }
      const folderAccess =
        await this.folderAccessService.getFolderAccessByDepartmentId(
          departmentId
        );
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
      const { name, type, description, folder, templateId } = req.body;
      const file = req.file;
      const uuid = req.uuidFile;
      const userId = req.documentUserId;
      const notSendEmailNew = req.body.notSendEmail || "false";
      const notSendEmail = JSON.parse(notSendEmailNew);
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

      const documentExists = await this.documentService.getDocumentByName(
        documentName
      );

      const invisible =
        documentExists &&
        documentExists.user.id === user.id &&
        documentExists.folder === folderKey
          ? true
          : false;

      const documentCreated = await this.documentService.createDocument({
        name: documentName,
        type,
        description,
        date,
        user,
        uuid,
        folder: folderKey,
        isInvisible: invisible,
      });

      if (!invisible) {
        await this.notificationService.createNotification({
          title: "Novo documento disponível",
          user,
          description: `Novo documento ${name} na pasta ${folder} recebido e pronto para download`,
        });
      }
      if (req.user?.id && req.user.role) {
        if (invisible) {
          this.assignLogToUser({
            userId: req.user.id,
            action: "Documento com mesmo nome ja existe",
            date: new Date(),
            description: `O Documento ${name} na pasta ${folder} do usuario ${user.name} no id {${documentCreated.id}} ja existe.`,
            role: req.user.role,
            state: "conflict",
          });
        } else {
          this.assignLogToUser({
            userId: req.user.id,
            action: "Documento adicionado",
            date: new Date(),
            description: `Novo documento ${name} na pasta ${folder} adicionado e pronto para download`,
            role: req.user.role,
            state: "success",
          });
        }
      }
      if (invisible) {
        res.status(409).json({
          message: `Conflito, o nome ${file.originalname} para o usuario ${userId} já existe.`,
        });
        return;
      }

      if (notSendEmail) {
        this.assignLogToUser({
          userId: req.user!.id,
          action: "Email não enviado",
          date: new Date(),
          description: `Email não enviado, por escolha do departamento ou administrador`,
          role: req.user!.role,
          state: "failure",
        });
        res.status(200).json({
          message: `Arquivo ${file.originalname} salvo com sucesso para o usuário ${userId}`,
        });
        return;
      }

      const userEmails =
        await this.emailUserDepartmentService.getAssociationByUserId(user.id);

      const userEmailsText = userEmails.map((email) => email.email).join(", ");

      try {
        const type = path.extname(uuid);
        const filePath = path.join(
          __dirname,
          `../../documents/${user.id}/${uuid}`
        );

        const pdfContent = fs.readFileSync(filePath);

        const depOrAdmin = await this.getDepOrAdminById(
          user.id,
          req.user?.role!
        );

        const templateExists =
          await this.emailTemplateService.getEmailTemplateById(templateId);

        const values = {
          nome: user.name,
          email: user.mainEmail,
          cpf: user.cpf || "Não Informado",
          cnpj: user.cnpj || "Não Informado",
        };

        const template = templateExists?.content || "Olá,";

        const formattedTemplate = this.replacePlaceholders(template, values);

        EmailHelper.sendMail({
          to: user.mainEmail + "," + userEmailsText,
          subject: templateExists?.subject || "Documentos para download",
          text: sendDocumentsMailDinamicTemplateOptions.text(formattedTemplate),
          html: sendDocumentsMailDinamicTemplateOptions.html(
            user.name,
            folder,
            formattedTemplate.replace(/\n/g, "<br/>")
          ),
          attachments: sendDocumentsMailOptions.attachments(
            documentName,
            type,
            pdfContent
          ),
        }).then((result) => {
          if (req.user?.id && req.user.role) {
            if (result) {
              this.assignLogToUser({
                userId: req.user.id,
                action: "Email enviado com Sucesso",
                date: new Date(),
                description: `Sucesso ao enviar o email para ${userEmailsText} com o documento ${documentName}`,
                role: req.user.role,
                state: "success",
              });
            } else {
              if (req.user?.id && req.user.role) {
                this.assignLogToUser({
                  userId: req.user.id,
                  action: "Falha ao enviar o email",
                  date: new Date(),
                  description: `Falha ao enviar o email para o email ${userEmailsText},  usuario - ${user.name}, com o documento - ${documentName}, u ID{${user.id}} c ID {${documentCreated.id}}`,
                  role: req.user.role,
                  state: "failure",
                });
              }
            }
          }
        });
      } catch (error) {}
      res.status(200).json({
        message: `Arquivo ${file.originalname} salvo com sucesso para o usuário ${userId}`,
      });
    } catch (error: any) {
      this.handleError(res, error, "Erro ao fazer upload do arquivo");
    }
  };

  public trySendEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const documentId = parseInt(req.params.documentId);
      const logId = parseInt(req.params.logId);
      const userId = this.getUserId(req);

      if (!userId) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      const documentExists = await this.documentService.getDocumentById(
        documentId
      );

      if (!documentExists) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }
    } catch (error: any) {
      this.handleError(res, error, "Erro ao fazer upload do arquivo");
    }
  };

  public holdDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const documentId = parseInt(req.params.documentId);
      const logId = parseInt(req.params.logId);

      const documentExists = await this.documentService.getDocumentById(
        documentId
      );

      if (!documentExists) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      documentExists.isInvisible = false;

      const documentUpdated = await this.documentService.updateDocument(
        documentId,
        documentExists
      );

      if (!documentUpdated) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      const newData = {
        action: "Documento mantido",
        state: "success",
        description: `Documento ${documentId} mantido com sucesso`,
      };

      const updatedLog = await this.updateLogToUser(
        logId,
        req.user?.role!,
        newData
      );

      if (updatedLog) {
        res.json(documentUpdated);
      } else {
        res.status(404).json({ message: "Log não encontrado" });
      }
    } catch (error: any) {
      this.handleError(res, error, "Erro ao fazer upload do arquivo");
    }
  };

  public discardDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const documentId = parseInt(req.params.documentId);
      const logId = parseInt(req.params.logId);
      const documentExists = await this.documentService.getDocumentById(
        documentId
      );

      if (!documentExists) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      const deletedDocument = await this.documentService.deleteDocument(
        documentId
      );

      if (!deletedDocument) {
        res.status(404).json({ message: "Documento não encontrado" });
        return;
      }

      const newData = {
        action: "Documento descartado",
        state: "success",
        description: `Documento ${documentId} descartado com sucesso`,
      };

      const sa = await this.updateLogToUser(logId, req.user?.role!, newData);
      res.json(deletedDocument);
    } catch (error: any) {
      this.handleError(res, error, "Erro ao fazer upload do arquivo");
    }
  };
}
