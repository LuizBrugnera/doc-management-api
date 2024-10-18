import { Request, Response, NextFunction } from "express";

export const roleAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
  rolesAllowed: string[]
): void => {
  try {
    const role = req.user?.role;

    if (!role) {
      res.status(401).send("Acesso negado.");
      return;
    }

    if (!rolesAllowed.includes(role)) {
      res.status(403).send("Acesso negado.");
      return;
    }
    next();
  } catch (error) {
    res.status(400).send("Token inválido.");
  }
};
