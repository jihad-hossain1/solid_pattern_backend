import { ITodoRepository } from "../../core/repositories/ITodoRepository";
import { Todo } from "../../core/entities/Todo";
import { db } from "../database/db";
import { todos } from "../database/schema";
import { eq } from "drizzle-orm";

export class MySQLTodoRepository implements ITodoRepository {
  async create(todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo> {
    const [result] = await db.insert(todos).values(todoData).$returningId();
    // Assuming MySQL returns the ID properly or we fetch it. 
    // Drizzle's $returningId() is typically for getting the ID.
    // However, to return the full object as per the interface, we might need to fetch it or construct it.
    // For simplicity with Drizzle/MySQL which doesn't support RETURNING * in some versions, we often do a fetch or just return what we know.
    // Let's keep it robust by fetching or constructing.
    
   // Use a basic select since insertId is available
    const id = result.id;
    
    return new Todo(
      id,
      todoData.title,
      todoData.description,
      todoData.completed,
      new Date(), // approximate
      new Date()  // approximate
    );
  }

  async findAll(): Promise<Todo[]> {
    const result = await db.select().from(todos);
    return result.map(t => new Todo(t.id, t.title, t.description, t.completed, t.createdAt, t.updatedAt));
  }

  async findById(id: number): Promise<Todo | null> {
    const result = await db.select().from(todos).where(eq(todos.id, id));
    if (result.length === 0) return null;
    const t = result[0];
    return new Todo(t.id, t.title, t.description, t.completed, t.createdAt, t.updatedAt);
  }

  async update(id: number, todoData: Partial<Todo>): Promise<void> {
    await db.update(todos).set(todoData).where(eq(todos.id, id));
  }

  async delete(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }
}
