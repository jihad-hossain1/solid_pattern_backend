import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { rateLimiter } from "hono-rate-limiter";
import { v1Router } from "./presentation/routes/v1";
import dotenv from "dotenv";

dotenv.config();

// Critical Security Check
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not defined. Exiting...");
  process.exit(1);
}

const app = new Hono();

// Security Middleware
app.use("*", secureHeaders());
app.use("*", cors());
app.use("*", bodyLimit({ maxSize: 100 * 1024 })); // 100KB limit
app.use("*", rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, 
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("x-forwarded-for") || "unknown", 
}));

app.use("*", logger());

app.get("/", (c) => c.text("Hello Hono!"));

// Mount V1 API
app.route("/api/v1", v1Router);

// Redirect /todos to /api/v1/todos for backward compatibility (optional)
app.get("/todos", (c) => c.redirect("/api/v1/todos"));

export default app;
