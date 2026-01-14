import { Hono } from "hono";
import { todoRouter } from "./todoRoutes";
import { authRouter } from "./authRoutes";

const v1Router = new Hono();

v1Router.route("/auth", authRouter);
v1Router.route("/todos", todoRouter);

export { v1Router };
