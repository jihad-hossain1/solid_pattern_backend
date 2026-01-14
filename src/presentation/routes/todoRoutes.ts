import { Hono } from "hono";
import { TodoController } from "../controllers/TodoController";
import { MySQLTodoRepository } from "../../infrastructure/repositories/MySQLTodoRepository";
import { CreateTodo } from "../../core/use-cases/CreateTodo";
import { GetTodos } from "../../core/use-cases/GetTodos";
import { UpdateTodo } from "../../core/use-cases/UpdateTodo";
import { DeleteTodo } from "../../core/use-cases/DeleteTodo";

const todoRouter = new Hono();

// Composition Root (Dependency Injection)
const todoRepository = new MySQLTodoRepository();
const createTodo = new CreateTodo(todoRepository);
const getTodos = new GetTodos(todoRepository);
const updateTodo = new UpdateTodo(todoRepository);
const deleteTodo = new DeleteTodo(todoRepository);
const todoController = new TodoController(createTodo, getTodos, updateTodo, deleteTodo);

todoRouter.get("/", (c) => todoController.index(c));
todoRouter.post("/", (c) => todoController.create(c));
todoRouter.put("/:id", (c) => todoController.update(c));
todoRouter.delete("/:id", (c) => todoController.delete(c));

export { todoRouter };
