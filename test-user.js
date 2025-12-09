const request = require("supertest");
const app = require(".src/index.js");

describe("POST /api/v1/users", () => {

  test("should create a user successfully", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        email: "john@example.com",
        age: 25
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("john@example.com");
  });

  test("should fail when email is missing", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        age: 25
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Email is required");
  });

  test("should fail with invalid email format", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        email: "bad-email",
        age: 25
      });

    expect(res.statusCode).toBe(422);
  });

});
