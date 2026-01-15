import { IUserRepository } from "../repositories/IUserRepository";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
  }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    return this.userRepository.create({
      email: data.email,
      username: data.username,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
    });
  }
}
