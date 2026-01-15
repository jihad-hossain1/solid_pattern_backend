import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is missing. Please create a .env file with your database connection string."
  );
}

const connection = mysql.createPool(databaseUrl);

export const db = drizzle(connection, { schema, mode: "default" });
