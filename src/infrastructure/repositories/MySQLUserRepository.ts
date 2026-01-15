import { IUserRepository } from "../../core/repositories/IUserRepository";
import { User } from "../../core/entities/User";
import { db } from "../database/db";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";

export class MySQLUserRepository implements IUserRepository {
  async create(payload: {
    email: string;
    username: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    mobile?: string;
    businessId?: number;
  }): Promise<User> {
    const defaultBusinessId = 1; // Default to 1 for migration compatibility
    const finalBusinessId = payload.businessId ?? defaultBusinessId;

    const [result] = await db
      .insert(users)
      .values({
        email: payload.email,
        username: payload.username,
        password: payload.passwordHash,
        firstName: payload.firstName,
        lastName: payload.lastName,
        isActive: payload.isActive ?? false,
        mobile: payload.mobile,
        businessId: finalBusinessId,
      })
      .$returningId();

    return new User(
      result.id,
      payload.email,
      payload.username,
      payload.firstName ?? null,
      payload.lastName ?? null,
      payload.isActive ?? false,
      new Date(),
      new Date(),
      finalBusinessId
    );
  }

  async findByEmail(
    email: string
  ): Promise<{ user: User; passwordHash: string } | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    if (result.length === 0) return null;
    const u = result[0];
    return {
      user: new User(
        u.id,
        u.email,
        u.username,
        u.firstName,
        u.lastName,
        u.isActive,
        u.createdAt,
        u.updatedAt,
        u.businessId
      ),
      passwordHash: u.password,
    };
  }

  async findById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    if (result.length === 0) return null;
    const u = result[0];
    return new User(
      u.id,
      u.email,
      u.username,
      u.firstName,
      u.lastName,
      u.isActive,
      u.createdAt,
      u.updatedAt,
      u.businessId
    );
  }
}
