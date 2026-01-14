import { IUserRepository } from "../../core/repositories/IUserRepository";
import { User } from "../../core/entities/User";
import { db } from "../database/db";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";

export class MySQLUserRepository implements IUserRepository {
  async create(userData: { email: string; passwordHash: string; name?: string }): Promise<User> {
    const [result] = await db.insert(users).values({
      email: userData.email,
      password: userData.passwordHash,
      name: userData.name,
    }).$returningId();

    return new User(
      result.id,
      userData.email,
      userData.name ?? null,
      new Date(),
      new Date()
    );
  }

  async findByEmail(email: string): Promise<{ user: User; passwordHash: string } | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    if (result.length === 0) return null;
    const u = result[0];
    return {
      user: new User(u.id, u.email, u.name, u.createdAt, u.updatedAt),
      passwordHash: u.password
    };
  }

  async findById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    if (result.length === 0) return null;
    const u = result[0];
    return new User(u.id, u.email, u.name, u.createdAt, u.updatedAt);
  }
}
