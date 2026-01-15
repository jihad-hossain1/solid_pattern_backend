import { User } from "../entities/User";

export interface IUserRepository {
  create(user: TUser): Promise<User>;
  findByEmail(email: string): TFindByEmailReturn;
  findById(id: number): Promise<User | null>;
}

export type TUser = {
  email: string;
  username: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  mobile?: string;
  businessId?: number;
};

export type TFindByEmailReturn = Promise<{
  user: User;
  passwordHash: string;
} | null>;
