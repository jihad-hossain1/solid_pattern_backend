import { Hono } from "hono";
import { logger } from "hono/logger";
import { v1Router } from "./presentation/routes/v1";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => c.text("Hello Hono!"));

// Mount V1 API
app.route("/api/v1", v1Router);

// Redirect /todos to /api/v1/todos for backward compatibility (optional)
app.get("/todos", (c) => c.redirect("/api/v1/todos"));

export default app;
