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

  private getUserId(c: Context): number {
    const payload = c.get("jwtPayload");
    if (!payload || !payload.sub) {
        throw new Error("Unauthorized");
    }
    return Number(payload.sub);
  }

  async index(c: Context) {
    try {
      const userId = this.getUserId(c);
      const query = (c.req as any).valid('query');
      const page = query.page;
      const limit = query.limit;

      const result = await this.getTodos.execute(userId, page, limit);
      
      return c.json({
        data: result.data,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        }
      });
    } catch (error) {
       console.error(error);
       return c.json({ error: 'Internal Server Error' }, 500);
    }
  }

  async create(c: Context) {
    try {
      const userId = this.getUserId(c);
      const body = (c.req as any).valid('json');
      const todo = await this.createTodo.execute(userId, body.title, body.description ?? null);
      return c.json(todo, 201);
    } catch (error: any) {
      if (error.message === 'Unauthorized') return c.json({ error: error.message }, 401);
      return c.json({ error: error.message }, 400);
    }
  }

  async update(c: Context) {
    try {
      const userId = this.getUserId(c);
      const { id } = (c.req as any).valid('param');
      const body = (c.req as any).valid('json');
      
      await this.updateTodo.execute(id, userId, body);
      return c.json({ message: "Updated successfully" });
    } catch (error: any) {
      if (error.message === "Todo not found") {
        return c.json({ error: error.message }, 404);
      }
      if (error.message === 'Unauthorized') return c.json({ error: error.message }, 401);
      return c.json({ error: error.message }, 400);
    }
  }

  async delete(c: Context) {
    try {
      const userId = this.getUserId(c);
      const { id } = (c.req as any).valid('param');
      await this.deleteTodo.execute(id, userId);
      return c.json({ message: "Deleted successfully" });
    } catch (error: any) {
       if (error.message === "Todo not found") {
        return c.json({ error: error.message }, 404);
      }
      if (error.message === 'Unauthorized') return c.json({ error: error.message }, 401);
      return c.json({ error: error.message }, 500);
    }
  }
}
