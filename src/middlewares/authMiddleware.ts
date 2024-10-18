import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Acesso negado.");
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY as string);
    const { id, email, iat, exp, department, role, folderAccess } =
      verified as {
        id: string;
        email: string;
        iat: number;
        exp: number;
        department?: string;
        role: string;
        folderAccess?: {
          id: number;
          foldername: string;
          departmentId: number;
        }[];
      };
    req.user = {
      id: +id,
      email,
      iat: +iat,
      exp: +exp,
      department,
      role,
      folderAccess,
    };
    next();
  } catch (error) {
    res.status(400).send("Token inválido.");
  }
};
