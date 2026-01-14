import { ITodoRepository } from "../repositories/ITodoRepository";

export class UpdateTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: number, data: { title?: string; description?: string; completed?: boolean }): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    await this.todoRepository.update(id, data);
  }
}
