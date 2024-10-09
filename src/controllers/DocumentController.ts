import { Request, Response } from "express";
import { DocumentService } from "../services/DocumentService";

export class DocumentController {
  private documentService = new DocumentService();

  async getAllDocuments(req: Request, res: Response): Promise<Response> {
    try {
      const documents = await this.documentService.getAllDocuments();
      return res.json(documents);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getDocumentById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const document = await this.documentService.getDocumentById(id);
      if (!document) {
        return res.status(404).json({ message: "Documento não encontrado" });
      }
      return res.json(document);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async createDocument(req: Request, res: Response): Promise<Response> {
    try {
      const documentData = req.body;
      const document = await this.documentService.createDocument(documentData);
      return res.status(201).json(document);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateDocument(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const documentData = req.body;
      const document = await this.documentService.updateDocument(
        id,
        documentData
      );
      if (!document) {
        return res.status(404).json({ message: "Documento não encontrado" });
      }
      return res.json(document);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.documentService.deleteDocument(id);
      if (!success) {
        return res.status(404).json({ message: "Documento não encontrado" });
      }
      return res.json({ message: "Documento deletado com sucesso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
