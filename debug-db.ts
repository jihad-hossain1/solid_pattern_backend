import { db } from "./src/infrastructure/database/db";
import { todos } from "./src/infrastructure/database/schema";

async function main() {
  try {
    console.log("Checking connection...");
    const result = await db.select().from(todos);
    console.log("Connection successful. Todos:", result);
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}

main();
