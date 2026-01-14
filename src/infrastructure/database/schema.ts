import { mysqlTable, bigint, varchar, boolean, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  // Use unsigned for ID, standard for auto increments usually
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const todos = mysqlTable("todos", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  // Match unsigned exactly
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
