import { Context } from "hono";
import { CreateTodo } from "../../core/use-cases/CreateTodo";
import { GetTodos } from "../../core/use-cases/GetTodos";
import { UpdateTodo } from "../../core/use-cases/UpdateTodo";
import { DeleteTodo } from "../../core/use-cases/DeleteTodo";

export class TodoController {
  constructor(
    private createTodo: CreateTodo,
    private getTodos: GetTodos,
    private updateTodo: UpdateTodo,
    private deleteTodo: DeleteTodo
  ) {}

  async index(c: Context) {
    try {
      const todos = await this.getTodos.execute();
      return c.json(todos);
    } catch (error) {
       return c.json({ error: 'Internal Server Error' }, 500);
    }
  }

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const todo = await this.createTodo.execute(body.title, body.description);
      return c.json(todo, 201);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  }

  async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      await this.updateTodo.execute(id, body);
      return c.json({ message: "Updated successfully" });
    } catch (error: any) {
      if (error.message === "Todo not found") {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: error.message }, 400);
    }
  }

  async delete(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await this.deleteTodo.execute(id);
      return c.json({ message: "Deleted successfully" });
    } catch (error: any) {
       if (error.message === "Todo not found") {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: error.message }, 500);
    }
  }
}
