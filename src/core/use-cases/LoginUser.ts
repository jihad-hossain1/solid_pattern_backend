import { IUserRepository } from "../repositories/IUserRepository";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string, jwtSecret: string): Promise<{ user: User; token: string }> {
    const record = await this.userRepository.findByEmail(email);
    if (!record) {
      throw new Error("Invalid credentials");
    }

    const { user, passwordHash } = record;
    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    };
    
    const token = await sign(payload, jwtSecret);

    return { user, token };
  }
}
