import { ITodoRepository } from "../repositories/ITodoRepository";

export class DeleteTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(id: number): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    await this.todoRepository.delete(id);
  }
}
