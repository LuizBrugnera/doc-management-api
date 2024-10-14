import { Request, Response } from "express";
import { DocumentService } from "../services/DocumentService";

export class DocumentController {
  private documentService = new DocumentService();

  public getAllDocuments = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const documents = await this.documentService.getAllDocuments();
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
      }
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
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
      }
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteDocument = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const success = await this.documentService.deleteDocument(id);
      if (!success) {
        res.status(404).json({ message: "Documento não encontrado" });
      }
      res.json({ message: "Documento deletado com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
