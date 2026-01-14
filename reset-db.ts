import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function resetDb() {
  const url = process.env.DATABASE_URL!;
  const urlObj = new URL(url);
  const dbName = urlObj.pathname.substring(1); 
  
  const connection = await mysql.createConnection({
    host: urlObj.hostname,
    user: urlObj.username,
    password: urlObj.password,
    port: Number(urlObj.port),
  });

  await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
  await connection.query(`CREATE DATABASE \`${dbName}\`;`);
  console.log(`Database ${dbName} reset.`);
  await connection.end();
}

resetDb().catch(console.error);
