const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app.js");
const { User, Role } = require("../../models/index.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  await mongoose.connect(
    `${process.env.MONGO_CLUSTER_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  );

  const adminRole = await Role.create({ name: "admin" });
  await Role.create({ name: "user" });

  const user = await User.create({
    name: "Erza",
    email: "erzajuan@gmail.com",
    password: await bcrypt.hash("123456", parseInt(process.env.SALT)),
    role_id: adminRole._id,
  });

  adminToken = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.name,
      role_id: user.role_id,
      role: adminRole.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    process.env.JWT_SECRET_KEY
  );
});

afterEach(async () => {
  await User.deleteMany();
  await Role.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/auth/register", () => {
  it("should register user successfully", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "John Doe",
        email: "john@test.com",
        password: "password123",
        role: "user",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.message).toBe("User registered successfully");
  });

  it("should fail if email already exists", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "John Doe",
        email: "john@test.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "John Doe",
        email: "john@test.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
  });

  it("should fail if email is missing", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "John Doe",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
  });
});
