import { Todo } from "../entities/Todo";

export interface ITodoRepository {
  create(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
  findAll(): Promise<Todo[]>;
  findById(id: number): Promise<Todo | null>;
  update(id: number, todo: Partial<Todo>): Promise<void>;
  delete(id: number): Promise<void>;
}
