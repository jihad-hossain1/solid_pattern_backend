import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AuthController } from "../../controllers/AuthController";
import { MySQLUserRepository } from "../../../infrastructure/repositories/MySQLUserRepository";
import { RegisterUser } from "../../../core/use-cases/RegisterUser";
import { LoginUser } from "../../../core/use-cases/LoginUser";
import { registerSchema, loginSchema } from "../../schemas/userSchemas";

const authRouter = new Hono();

const userRepository = new MySQLUserRepository();
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);
const authController = new AuthController(registerUser, loginUser);

authRouter.post(
  "/register",
  zValidator("json", registerSchema),
  (c) => authController.register(c)
);

authRouter.post(
  "/login",
  zValidator("json", loginSchema),
  (c) => authController.login(c)
);

export { authRouter };
