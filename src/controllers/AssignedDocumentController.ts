import { Request, Response } from "express";
import { AssignedDocumentService } from "../services/AssignedDocumentService";
import { DocumentService } from "../services/DocumentService";
import { stat } from "fs";

export class AssignedDocumentController {
  private assignedDocumentService = new AssignedDocumentService();
  private documentService = new DocumentService();

  public getAllAssignedDocuments = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const assignedDocuments =
        await this.assignedDocumentService.getAllAssignedDocuments();
      res.json(assignedDocuments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public getAssignedDocumentById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const assignedDocument =
        await this.assignedDocumentService.getAssignedDocumentById(id);
      if (!assignedDocument) {
        res.status(404).json({ message: "AssignedDocument não encontrado" });
      }
      res.json(assignedDocument);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public createAssignedDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = req.body;

      const { documentId, osId } = data;
      console.log(documentId, osId);
      const documentExists = await this.documentService.getDocumentById(
        documentId
      );

      if (!documentExists) {
        res.status(404).json({ message: "Document not found" });
        return;
      }

      const osExists = await this.documentService.getDocumentById(osId);

      if (!osExists) {
        res.status(404).json({ message: "Os not found" });
        return;
      }

      const formatedData = {
        ...data,
        document: documentExists,
        os: osExists,
        historico: "",
        status: "no_prazo",
      };

      const assignedDocument =
        await this.assignedDocumentService.createAssignedDocument(formatedData);

      res.status(201).json(assignedDocument);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateAssignedDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;

      if (data.documentId) {
        const documentExists = await this.documentService.getDocumentById(
          data.documentId
        );

        if (!documentExists) {
          res.status(404).json({ message: "Document not found" });
          return;
        }

        data.document = documentExists;
      }

      const assignedDocument =
        await this.assignedDocumentService.updateAssignedDocument(id, data);
      if (!assignedDocument) {
        res.status(404).json({ message: "AssignedDocument não encontrado" });
      }
      res.json(assignedDocument);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteAssignedDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.assignedDocumentService.deleteAssignedDocument(
        id
      );
      if (!success) {
        res.status(404).json({ message: "AssignedDocument não encontrado" });
      }
      res.json({ message: "AssignedDocument deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
