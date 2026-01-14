import { Context } from "hono";
import { RegisterUser } from "../../core/use-cases/RegisterUser";
import { LoginUser } from "../../core/use-cases/LoginUser";

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser
  ) {}

  async register(c: Context) {
    try {
      const body = (c.req as any).valid('json');
      const user = await this.registerUser.execute(body.email, body.password, body.name);
      return c.json({ user }, 201);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  }

  async login(c: Context) {
    try {
      const body = (c.req as any).valid('json');
      const secret = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";
      const { user, token } = await this.loginUser.execute(body.email, body.password, secret);
      return c.json({ user, token });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
          return c.json({ error: error.message }, 401);
      }
      return c.json({ error: error.message }, 400);
    }
  }
}
