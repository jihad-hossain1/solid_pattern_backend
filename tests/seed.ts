import { db } from "../src/infrastructure/database/db";
import { todos, users } from "../src/infrastructure/database/schema";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";

export const TEST_USER_EMAIL = "test@example.com";
export const TEST_USER_PASSWORD = "password123";
export let TEST_USER_TOKEN = "";

export const seedData = async () => {
  // Clear existing data
  await db.delete(todos);
  await db.delete(users);

  // Insert test user
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(TEST_USER_PASSWORD, salt);
  
  const [userResult] = await db.insert(users).values({
    email: TEST_USER_EMAIL,
    password: passwordHash,
    name: "Test User",
  }).$returningId();

  const userId = userResult.id;

  // Generate Token
   const payload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
   // Use default secret from code
   TEST_USER_TOKEN = await sign(payload, "fallback_secret_do_not_use_in_prod");

  // Insert seed todos
  await db.insert(todos).values([
    {
      userId: userId,
      title: "Test Todo 1",
      description: "Description for test todo 1",
      completed: false,
    },
    {
        userId: userId,
        title: "Test Todo 2",
        description: "Description for test todo 2",
        completed: true,
      },
  ]);
};

export const clearData = async () => {
    await db.delete(todos);
    await db.delete(users);
};
