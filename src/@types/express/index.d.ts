interface UserAuth {
  id: number;
  email: string;
  department?: string;
  role: string;
  folderAccess?: {
    id: number;
    foldername: string;
    departmentId: number;
  }[];
  iat: number;
  exp: number;
}
declare namespace Express {
  interface Request {
    user?: UserAuth;
    uuidFile?: string;
    originalFilename?: string;
    documentUserId?: number;
  }
}
