import { IUserRepository } from "../repositories/IUserRepository";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string, name?: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return this.userRepository.create({ email, passwordHash, name });
  }
}
