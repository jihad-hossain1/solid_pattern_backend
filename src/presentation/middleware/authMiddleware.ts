import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

export const authMiddleware = createMiddleware(async (c, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  
  const jwtMiddleware = jwt({
    secret,
    alg: "HS256"
  });
  return jwtMiddleware(c, next);
});
