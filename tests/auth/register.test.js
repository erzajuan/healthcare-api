const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app.js");
const { User } = require("../../models/index.js");

beforeAll(async () => {
  await mongoose.connect(
    `${process.env.MONGO_CLUSTER_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  );
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/auth/register", () => {
  it("should register user successfully", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "John Doe",
      email: "john@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.message).toBe("User registered successfully");
  });

  it("should fail if email already exists", async () => {
    await User.create({
      name: "John",
      email: "john@test.com",
      password: "hashedpassword",
    });

    const res = await request(app).post("/api/v1/auth/register").send({
      name: "John",
      email: "john@test.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should fail if email is missing", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "John",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });
});
