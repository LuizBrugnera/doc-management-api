import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { UserService } from "../services/UserService";

function getFileNameWithoutExtension(fileName: string): string {
  const filenameTrimmed = fileName.trim();
  const lastDotIndex = filenameTrimmed.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return filenameTrimmed;
  }
  return filenameTrimmed.substring(0, lastDotIndex);
}

function normalizeText(text: string) {
  const textNormalized = text.normalize("NFD");
  const textWithOutAccents = textNormalized.replace(/[\u0300-\u036f]/g, "");
  const textFinal = textWithOutAccents.replace(/ç/g, "c").replace(/Ç/g, "C");
  return textFinal;
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userService = new UserService();
      console.log(file.originalname);
      const filenameWithoutExtension = normalizeText(
        getFileNameWithoutExtension(
          Buffer.from(file.originalname, "latin1").toString("utf8")
        )
      );
      console.log(filenameWithoutExtension);
      const user = await userService.getUserByNameInString(
        filenameWithoutExtension.trim()
      );
      console.log(user);
      if (!user) {
        return cb(new Error("Usuário não encontrado, upload descartado"), "");
      }

      req.documentUserId = user.id;
      const userDir = path.join(__dirname, `../../documents/${user.id}`);

      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      cb(null, userDir);
    } catch (error) {
      cb(new Error(String(error)), "");
    }
  },
  filename: (req, file, cb) => {
    const tempFilename = uuidv4();
    const type = file.originalname.split(".").pop();
    const filename = `${tempFilename}${type ? `.${type}` : ""}`;
    req.uuidFile = filename;
    req.originalFilename = file.originalname;
    req.body.type = type;
    cb(null, filename);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não suportado"));
  }
};

export const autoAssignUpload = multer({
  limits: { fileSize: 100 * 1024 * 1024 },
  storage,
  fileFilter,
});
