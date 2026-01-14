import { ITodoRepository } from "../repositories/ITodoRepository";
import { Todo } from "../entities/Todo";

export class CreateTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(userId: number, title: string, description: string | null): Promise<Todo> {
    if (!title) {
      throw new Error("Title is required");
    }
    return this.todoRepository.create({ userId, title, description, completed: false });
  }
}
