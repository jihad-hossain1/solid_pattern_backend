import { ITodoRepository, PaginatedResult } from "../repositories/ITodoRepository";
import { Todo } from "../entities/Todo";

export class GetTodos {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(userId: number, page: number, limit: number): Promise<PaginatedResult<Todo>> {
    const offset = (page - 1) * limit;
    return this.todoRepository.findAll(userId, offset, limit);
  }
}
