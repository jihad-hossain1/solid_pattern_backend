import { db } from "../src/infrastructure/database/db";
import { todos } from "../src/infrastructure/database/schema";

export const seedData = async () => {
  // Clear existing data
  await db.delete(todos);

  // Insert seed data
  await db.insert(todos).values([
    {
      title: "Test Todo 1",
      description: "Description for test todo 1",
      completed: false,
    },
    {
        title: "Test Todo 2",
        description: "Description for test todo 2",
        completed: true,
      },
  ]);
};

export const clearData = async () => {
    await db.delete(todos);
};
