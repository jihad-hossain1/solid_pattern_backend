import { Hono } from "hono";
import { logger } from "hono/logger";
import { todoRouter } from "./presentation/routes/todoRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/todos", todoRouter);

export default app;
