import request from "supertest";
import app from "../src/app";
import { seedData, clearData } from "./seed";
import { getRequestListener } from "@hono/node-server";

const server = getRequestListener(app.fetch);

describe("Todo API Integration Tests", () => {
  
  beforeAll(async () => {
     // Ensure we start with a clean state or seeded state
     await seedData();
  });


  afterAll(async () => {
    // Clean up after tests
    await clearData();
    // Force exit is enabled in jest config, but good practice to close pools if possible.
    // drizzle-orm/mysql2 pool doesn't expose a simple end() on the drizzle object easily 
    // without access to the underlying connection pool if not exported.
    // But since we use forceExit, it should be fine.
  });

  describe("GET /todos", () => {
    it("should return a list of todos", async () => {
      const response = await request(server).get("/todos");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty("title");
    });
  });

  describe("POST /todos", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        title: "New Integration Todo",
        description: "Testing POST endpoint",
      };

      const response = await request(server)
        .post("/todos")
        .send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.description).toBe(newTodo.description);
      expect(response.body.completed).toBe(false);
    });

    it("should return 400 if title is missing", async () => {
      const invalidTodo = {
        description: "Missing title",
      };

      const response = await request(server)
        .post("/todos")
        .send(invalidTodo);

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update an existing todo", async () => {
      // First get a todo to update
      const listResponse = await request(server).get("/todos");
      const todoToUpdate = listResponse.body[0];

      const updateData = {
        title: "Updated Title",
        completed: true,
      };

      const response = await request(server)
        .put(`/todos/${todoToUpdate.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Updated successfully");

      // Verify update
      const getResponse = await request(server).get("/todos");
      const updatedTodo = getResponse.body.find((t: any) => t.id === todoToUpdate.id);
      expect(updatedTodo.title).toBe(updateData.title);
      expect(updatedTodo.completed).toBe(true);
    });

    it("should return 404 for non-existent todo", async () => {
      const response = await request(server)
        .put("/todos/999999")
        .send({ title: "Ghost" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete an existing todo", async () => {
       // Create a temp todo to delete so we don't mess up other tests too much 
       // (though sequential running helps)
       const createRes = await request(server).post("/todos").send({ title: "To Delete" });
       const todoId = createRes.body.id;

       const response = await request(server).delete(`/todos/${todoId}`);
       expect(response.status).toBe(200);
       expect(response.body.message).toBe("Deleted successfully");

       // Verify deletion
       const checkRes = await request(server).put(`/todos/${todoId}`).send({ title: "check" });
       expect(checkRes.status).toBe(404);
    });

    it("should return 404 for non-existent todo", async () => {
      const response = await request(server).delete("/todos/999999");
      expect(response.status).toBe(404);
    });
  });
});
