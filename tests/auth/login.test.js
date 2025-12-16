const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app.js");
const { User } = require("../../models/index.js");
const bcrypt = require("bcrypt");

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

describe("POST /api/v1/auth/login", () => {
  it("should login user successfully", async () => {
    await User.create({
      name: "Erza",
      email: "erzajuan@gmail.com",
      password: await bcrypt.hash("123456", parseInt(process.env.SALT)),
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "erzajuan@gmail.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.meta.message).toBe("User logged in successfully");
  });

  it("should fail if email wrong", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "johny@test.com",
      password: "hashedpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should fail if email is missing", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
  });
});
