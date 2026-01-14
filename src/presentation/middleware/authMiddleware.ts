import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

export const authMiddleware = createMiddleware(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod",
    alg: "HS256"
  });
  return jwtMiddleware(c, next);
});
