import {
  ITodoRepository,
  PaginatedResult,
} from "../../core/repositories/ITodoRepository";
import { Todo } from "../../core/entities/Todo";

export class MySQLTodoRepository implements ITodoRepository {
  async create(
    todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">
  ): Promise<Todo> {
    throw new Error(
      "Feature disabled due to schema migration. 'todos' table does not exist."
    );
  }

  async findAll(
    userId: number,
    offset: number,
    limit: number
  ): Promise<PaginatedResult<Todo>> {
    throw new Error(
      "Feature disabled due to schema migration. 'todos' table does not exist."
    );
  }

  async findById(id: number): Promise<Todo | null> {
    throw new Error(
      "Feature disabled due to schema migration. 'todos' table does not exist."
    );
  }

  async update(
    id: number,
    userId: number,
    todoData: Partial<Todo>
  ): Promise<void> {
    throw new Error(
      "Feature disabled due to schema migration. 'todos' table does not exist."
    );
  }

  async delete(id: number, userId: number): Promise<void> {
    throw new Error(
      "Feature disabled due to schema migration. 'todos' table does not exist."
    );
  }
}
