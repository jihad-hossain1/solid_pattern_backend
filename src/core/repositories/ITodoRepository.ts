import { Todo } from "../entities/Todo";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface ITodoRepository {
  create(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
  findAll(userId: number, offset: number, limit: number): Promise<PaginatedResult<Todo>>;
  findById(id: number): Promise<Todo | null>;
  update(id: number, userId: number, todo: Partial<Todo>): Promise<void>;
  delete(id: number, userId: number): Promise<void>;
}
