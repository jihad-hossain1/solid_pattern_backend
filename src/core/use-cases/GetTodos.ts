import { ITodoRepository } from "../repositories/ITodoRepository";
import { Todo } from "../entities/Todo";

export class GetTodos {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }
}
