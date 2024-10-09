import { DataSource } from "typeorm";
import { Admin } from "./entities/Admin";
import { AdminLog } from "./entities/AdminLog";
import { Department } from "./entities/Department";
import { Document } from "./entities/Document";
import { EmailUserDepartment } from "./entities/EmailUserDepartment";
import { FolderAccess } from "./entities/FolderAccess";
import { Log } from "./entities/Log";
import { Notification } from "./entities/Notification";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123456",
  database: "documents-db",
  entities: [
    Admin,
    AdminLog,
    Department,
    Document,
    EmailUserDepartment,
    FolderAccess,
    Log,
    Notification,
    User,
  ],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
