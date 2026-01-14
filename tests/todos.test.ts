import request from "supertest";
import app from "../src/app";
import { seedData, clearData, TEST_USER_TOKEN } from "./seed";
import { getRequestListener } from "@hono/node-server";

const server = getRequestListener(app.fetch);

describe("Todo API Integration Tests (Authenticated)", () => {
  
  beforeAll(async () => {
     await seedData();
  });

  afterAll(async () => {
    await clearData();
  });

  describe("Authentication", () => {
      it("should register a new user", async () => {
          const res = await request(server).post("/api/v1/auth/register").send({
              email: "newuser@example.com",
              password: "password123",
              name: "New User"
          });
          expect(res.status).toBe(201);
          expect(res.body.user).toHaveProperty("email", "newuser@example.com");
      });

      it("should login an existing user", async () => {
        const res = await request(server).post("/api/v1/auth/login").send({
            email: "newuser@example.com",
            password: "password123",
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
  });

  describe("GET /todos", () => {
    it("should return 401 if unauthenticated", async () => {
        const response = await request(server).get("/api/v1/todos");
        expect(response.status).toBe(401);
    });

    it("should return a paginated list of todos for authenticated user", async () => {
      const response = await request(server)
        .get("/api/v1/todos")
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("POST /todos", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        title: "New Integration Todo",
        description: "Testing POST endpoint",
      };

      const response = await request(server)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`)
        .send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(newTodo.title);
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update an existing todo", async () => {
      // First get a todo to update
      const listResponse = await request(server)
        .get("/api/v1/todos")
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`);
      
      const todoToUpdate = listResponse.body.data[0];

      const updateData = {
        title: "Updated Title",
        completed: true,
      };

      const response = await request(server)
        .put(`/api/v1/todos/${todoToUpdate.id}`)
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`)
        .send(updateData);

      expect(response.status).toBe(200);
      
      // Verify
      const getResponse = await request(server)
        .get("/api/v1/todos")
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`);
      const updatedTodo = getResponse.body.data.find((t: any) => t.id === todoToUpdate.id);
      expect(updatedTodo.title).toBe(updateData.title);
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete an existing todo", async () => {
       const createRes = await request(server)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`)
        .send({ title: "To Delete" });
       const todoId = createRes.body.id;

       const response = await request(server)
        .delete(`/api/v1/todos/${todoId}`)
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`);
       
       expect(response.status).toBe(200);

       const checkRes = await request(server)
        .put(`/api/v1/todos/${todoId}`)
        .set("Authorization", `Bearer ${TEST_USER_TOKEN}`)
        .send({ title: "check" });
       expect(checkRes.status).toBe(404);
    });
  });
});
