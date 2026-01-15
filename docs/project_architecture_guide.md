# Ideal Project Architecture for Large Scale Backends

This document outlines the ideal structure for a large-scale, enterprise-grade backend application using **Clean Architecture** and **SOLID principles**.

When handling multiple entities, the biggest challenge is maintaining separation of concerns while keeping related code discoverable.

## The Core Philosophy: The Dependency Rule

The most critical rule is: **Dependencies point INWARDS.**
- **Presentation** (Controllers) depends on **Core** (Use Cases).
- **Infrastructure** (Database) depends on **Core** (Entities/Repositories Interfaces).
- **Core** depends on **NOTHING**. It contains pure business logic.

---

## Recommended Folder Structure

For a large project, verify strictly separating "Framework Code" from "Business Logic".

```text
src/
├── core/                       # THE DOAIN LAYER (Pure TS, No frameworks)
│   ├── common/                 # Shared types, result classes (Result<T>)
│   ├── entities/               # Enterprise business rules
│   │   ├── User.ts
│   │   └── Order.ts
│   ├── repositories/           # Interfaces ONLY (Contracts)
│   │   ├── IUserRepository.ts
│   │   └── IOrderRepository.ts
│   ├── use-cases/              # Application business rules
│   │   ├── user/
│   │   │   ├── CreateUser.ts
│   │   │   └── GetUser.ts
│   │   └── order/
│   │       ├── PlaceOrder.ts
│   │       └── CancelOrder.ts
│   └── errors/                 # Domain specific errors
│
├── infrastructure/             # THE ADAPTER LAYER (External tools)
│   ├── database/
│   │   ├── mappers/            # Convert DB rows <-> Entities
│   │   │   └── UserMapper.ts
│   │   ├── models/             # ORM Schemas (Drizzle/TypeORM)
│   │   │   └── schema.ts
│   │   └── repositories/       # Implementations of Core interfaces
│   │       ├── DrizzleUserRepository.ts
│   │       └── InMemoryUserRepository.ts
│   ├── logging/
│   ├── mailer/
│   └── config/                 # Environment validation
│
├── presentation/               # THE DELIVERY LAYER (HTTP/CLI)
│   ├── http/
│   │   ├── controllers/        # Receive Req, Call Use Case, Return Res
│   │   │   ├── UserController.ts
│   │   │   └── OrderController.ts
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── validators/         # Zod/Joi schemas for Input
│   │       └── userSchemas.ts
│   └── di/                     # Dependency Injection Container
│       └── container.ts
│
└── app.ts                      # Entry point (Composition Root)
```

---

## Scaling Strategy: Module-Based vs. Layer-Based

### Option A: Strict Layered (Best for Consistency)
*The structure above is Layered.*
- **Pros**: It forces you to think "Is this logic or generic code?". It's very easy to swap out frameworks (e.g., Express -> Hono) because your `core` folder never mistakenly imports `hono`.
- **Cons**: To add a feature, you touch 3 different top-level folders.

### Option B: Modular Architecture (Best for Velocity)
For **very big** projects (50+ entities), group by Feature first, then Layer.

```text
src/
├── modules/
│   ├── user/
│   │   ├── domain/           # Entities, Repo Interfaces
│   │   ├── user-cases/
│   │   ├── infra/            # Repositories impls
│   │   └── presentation/     # Controllers
│   └── order/
│       ├── domain/
│       ├── ...
├── shared/                   # Shared kernel
└── app.ts
```
**Recommendation**: Start with **Strict Layered** (Option A). Only switch to Modular if you have 5+ distinct teams working on the same repo.

---

## Detailed Implementation Guidelines

### 1. The Entity (Core)
Entities should be pure. They should validate their own state.

```typescript
// src/core/entities/User.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: "ADMIN" | "USER"
  ) {
    if (!email.includes("@")) throw new Error("Invalid email");
  }
}
```

### 2. The Repository Contract (Core)
This allows us to write the Use Case without knowing *which* database we use.

```typescript
// src/core/repositories/IUserRepository.ts
import { User } from "../entities/User";

export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
```

### 3. The Use Case (Core)
Orchestrates the flow. Accepts simple inputs (DTOs) and calls dependencies.

```typescript
// src/core/use-cases/user/CreateUser.ts
import { IUserRepository } from "../../repositories/IUserRepository";
import { User } from "../../entities/User";

export class CreateUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(id: string, email: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("User exists");

    const user = new User(id, email, "USER");
    await this.userRepo.save(user);
    return user;
  }
}
```

### 4. Dependency Injection (Infrastructure/Presentation)
This is how we wire it all together in [app.ts](file:///home/jihad/projects/learn/solid_pattern_backend/src/app.ts) or a container.

```typescript
// src/app.ts
const userRepository = new DrizzleUserRepository(db); // Infra
const createUserUseCase = new CreateUser(userRepository); // Core
const userController = new UserController(createUserUseCase); // Presentation

app.post("/users", (c) => userController.create(c));
```

## handling "Multiple Entities"
When you have `User`, `Product`, `Order`, `Invoice`, `Payment`:
1.  **Don't create a "God" repository.** Create `IProductRepository`, `IOrderRepository`, etc.
2.  **Use Cases shouldn't depend on other Use Cases.** If creating an Order requires checking User balance, the `CreateOrder` use case should expect `IUserRepository` injected, not `GetUserUseCase`.
3.  **Cross-Boundary Communication**: If an Order needs to trigger an Email, emit a **Domain Event** (Observer Pattern) rather than hardcoding the email logic inside the Order service.

---

## Checklist for Review
- [ ] Does `core` import `drizzle-orm` or `hono`? (If YES -> **FAIL**)
- [ ] Do controllers contain business logic? (If YES -> **FAIL**)
- [ ] Are Repositories returning DB Models (RowDataPacket) or Domain Entities? (Must be **Entities**)
