import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createDb() {
  // Parse existing URL to get host/user/password but strip database
  // Simple hack: assume URL format is standard
  const url = process.env.DATABASE_URL!;
  const urlObj = new URL(url);
  const dbName = urlObj.pathname.substring(1); // remove leading /
  
  // Connect to base
  const connection = await mysql.createConnection({
    host: urlObj.hostname,
    user: urlObj.username,
    password: urlObj.password,
    port: Number(urlObj.port),
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  console.log(`Database ${dbName} created or exists.`);
  await connection.end();
}

createDb().catch(console.error);
