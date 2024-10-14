import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Acesso negado.");
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY as string);
    const { id, email, iat, exp, department, role } = verified as {
      id: string;
      email: string;
      iat: number;
      exp: number;
      department: string;
      role: string;
    };
    req.user = {
      id: +id,
      email,
      iat: +iat,
      exp: +exp,
      department,
      role,
    };
    next();
  } catch (error) {
    res.status(400).send("Token inválido.");
  }
};
