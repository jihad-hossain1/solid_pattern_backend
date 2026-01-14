import { User } from "../entities/User";

export interface IUserRepository {
  create(user: { email: string; passwordHash: string; name?: string }): Promise<User>;
  findByEmail(email: string): Promise<{ user: User; passwordHash: string } | null>;
  findById(id: number): Promise<User | null>;
}
