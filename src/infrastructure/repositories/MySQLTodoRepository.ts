import { ITodoRepository, PaginatedResult } from "../../core/repositories/ITodoRepository";
import { Todo } from "../../core/entities/Todo";
import { db } from "../database/db";
import { todos } from "../database/schema";
import { eq, sql, and } from "drizzle-orm";

export class MySQLTodoRepository implements ITodoRepository {
  async create(todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo> {
    const [result] = await db.insert(todos).values(todoData).$returningId();
    const id = result.id;
    
    return new Todo(
      id,
      todoData.userId,
      todoData.title,
      todoData.description,
      todoData.completed,
      new Date(), 
      new Date()
    );
  }

  async findAll(userId: number, offset: number, limit: number): Promise<PaginatedResult<Todo>> {
    const data = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .limit(limit)
      .offset(offset);
    
    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(todos)
      .where(eq(todos.userId, userId));
      
    const total = countResult.count;

    return {
      data: data.map(t => new Todo(t.id, t.userId, t.title, t.description, t.completed, t.createdAt, t.updatedAt)),
      total
    };
  }

  async findById(id: number): Promise<Todo | null> {
    const result = await db.select().from(todos).where(eq(todos.id, id));
    if (result.length === 0) return null;
    const t = result[0];
    return new Todo(t.id, t.userId, t.title, t.description, t.completed, t.createdAt, t.updatedAt);
  }

  async update(id: number, userId: number, todoData: Partial<Todo>): Promise<void> {
    await db
      .update(todos)
      .set(todoData)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
  }

  async delete(id: number, userId: number): Promise<void> {
    await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
  }
}
