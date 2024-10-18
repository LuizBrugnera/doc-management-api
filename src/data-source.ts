import { DataSource } from "typeorm";
import { join } from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import dotenv from "dotenv";

dotenv.config();
const dir = __dirname;
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(dir, "entities", "*.{js,ts}")],
  migrations: [join(dir, "migrations", "*.{js,ts}")],
  synchronize: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
});
