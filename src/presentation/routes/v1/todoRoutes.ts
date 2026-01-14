import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { TodoController } from "../../controllers/TodoController";
import { MySQLTodoRepository } from "../../../infrastructure/repositories/MySQLTodoRepository";
import { CreateTodo } from "../../../core/use-cases/CreateTodo";
import { GetTodos } from "../../../core/use-cases/GetTodos";
import { UpdateTodo } from "../../../core/use-cases/UpdateTodo";
import { DeleteTodo } from "../../../core/use-cases/DeleteTodo";
import { authMiddleware } from "../../middleware/authMiddleware";
import { 
  paginationSchema, 
  createTodoSchema, 
  updateTodoSchema, 
  paramIdSchema 
} from "../../schemas/todoSchemas";

const todoRouter = new Hono();

// Composition Root (Dependency Injection)
const todoRepository = new MySQLTodoRepository();
const createTodo = new CreateTodo(todoRepository);
const getTodos = new GetTodos(todoRepository);
const updateTodo = new UpdateTodo(todoRepository);
const deleteTodo = new DeleteTodo(todoRepository);
const todoController = new TodoController(createTodo, getTodos, updateTodo, deleteTodo);

// Apply auth middleware to all routes in this router
todoRouter.use("*", authMiddleware);

todoRouter.get(
  "/", 
  zValidator("query", paginationSchema), 
  (c) => todoController.index(c)
);

todoRouter.post(
  "/", 
  zValidator("json", createTodoSchema), 
  (c) => todoController.create(c)
);

todoRouter.put(
  "/:id", 
  zValidator("param", paramIdSchema), 
  zValidator("json", updateTodoSchema), 
  (c) => todoController.update(c)
);

todoRouter.delete(
  "/:id", 
  zValidator("param", paramIdSchema), 
  (c) => todoController.delete(c)
);

export { todoRouter };
