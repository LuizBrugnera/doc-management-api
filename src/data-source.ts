import { DataSource } from "typeorm";
import { join } from "path";

const dir = __dirname;
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123456",
  database: "documents-db",
  entities: [join(dir, "entities", "*.{js,ts}")],
  migrations: [join(dir, "migrations", "*.{js,ts}")],
  synchronize: false,
  logging: false,
});
