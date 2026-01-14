# SOLID Clean Architecture Todo API

This project is a RESTful API for managing Todos, built with a strong focus on software design principles. It implements **SOLID** principles and **Clean Architecture** to ensure maintainability, scalability, and testability.

## 🚀 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Hono](https://hono.dev/) (Fast & Lightweight Web Standard Edge Framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: MySQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Testing**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

## 🏗️ Architecture

The project follows **Clean Architecture** (Onion Architecture) layers:

1.  **Core (Domain Layer)**: Contains the business logic and entities. It handles *what* the application does, independent of external frameworks.
    *   `entities/`: Core data structures (e.g., `Todo`).
    *   `repositories/`: Interfaces defining data access contracts (Dependency Inversion).
    *   `use-cases/`: Application-specific business rules (Single Responsibility).
2.  **Infrastructure Layer**: Implements the interfaces defined in the core. It handles *how* data is persisted.
    *   `database/`: Database connection and schema definitions.
    *   `repositories/`: Concrete implementations of repositories (e.g., `MySQLTodoRepository`).
3.  **Presentation Layer**: Handles the HTTP interface.
    *   `controllers/`: Handles incoming requests and maps them to use cases.
    *   `routes/`: Defines API endpoints and wires dependencies (Injection).

### SOLID Principles Applied
*   **S**ingle Responsibility: Each class/function has one job (e.g., separate Use Cases for Create, Read, Update, Delete).
*   **O**pen/Closed: New features (like a new storage backend) can be added by creating new implementations without modifying core logic.
*   **L**iskov Substitution: `MySQLTodoRepository` successfully substitutes `ITodoRepository`.
*   **I**nterface Segregation: Interfaces are kept focused.
*   **D**ependency Inversion: High-level modules (Use Cases) depend on abstractions (`ITodoRepository`), not concrete low-level modules.

## 📂 Project Structure

```bash
src/
├── core/
│   ├── entities/          # Domain models
│   ├── repositories/      # Interfaces
│   └── use-cases/         # Application logic
├── infrastructure/
│   ├── database/          # DB config & schema
│   └── repositories/      # DB implementations
├── presentation/
│   ├── controllers/       # HTTP handlers
│   └── routes/            # Route definitions
├── app.ts                 # App setup
└── index.ts               # Entry point
```

## 🛠️ Setup & Installation

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="mysql://root:root@localhost:3306/todo_db"
    PORT=3000
    ```
    *Update the user, password, and port matching your local MySQL setup.*

## 🗄️ Database Setup

1.  **Create the Database**:
    You can use the helper script to ensure the database exists:
    ```bash
    npx tsx create-db.ts
    ```

2.  **Run Migrations**:
    Apply the Drizzle schema to your MySQL database:
    ```bash
    npm run migrate
    ```

## 🏃 Running the Application

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
npm start
```

## 🧪 Running Tests

The project includes integration tests using Jest and Supertest.

```bash
npm test
```
*Note: This will use the configured database. Ensure your local MySQL instance is running.*

## 🔌 API Endpoints

| Method | Endpoint      | Description           | Body Parameters |
| :----- | :------------ | :-------------------- | :-------------- |
| GET    | `/todos`      | Get all todos         | N/A |
| POST   | `/todos`      | Create a new todo     | `{ "title": "...", "description": "..." }` |
| PUT    | `/todos/:id`  | Update a todo         | `{ "title": "...", "completed": true }` |
| DELETE | `/todos/:id`  | Delete a todo         | N/A |

### Example Request (Create Todo)
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn SOLID", "description": "Study architecture patterns"}'
```
