import { DocumentService } from "../services/DocumentService";
import { UserService } from "../services/UserService";

const fixUploadWrongDocuments = async () => {
  try {
    const documentService = new DocumentService();
    const userService = new UserService();
    const documents = await documentService.getDocumentsWithUsernames();

    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      if (!document.name.includes(document.username)) {
        const userFinded = await userService.getUserByNameInString(
          document.name
        );

        if (userFinded) {
          await documentService.updateDocumentUserId(
            document.id,
            userFinded.id
          );
        }
      }
    }
  } catch (error) {
    console.error("Erro no processo de atualização dos usuários:", error);
  }
};

fixUploadWrongDocuments();
