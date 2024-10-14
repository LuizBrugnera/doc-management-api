interface UserAuth {
  id: number;
  email: string;
  department?: string;
  role: string;
  iat: number;
  exp: number;
}
declare namespace Express {
  interface Request {
    user?: UserAuth;
  }
}
