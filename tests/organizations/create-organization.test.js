const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const { User, Role, Organization } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let adminToken;
let userToken;

beforeAll(async () => {
  await mongoose.connect(
    `${process.env.MONGO_CLUSTER_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  );

  // seed roles
  const adminRole = await Role.create({ name: "admin" });
  const userRole = await Role.create({ name: "user" });

  // seed users
  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: await bcrypt.hash("123456", parseInt(process.env.SALT)),
    role_id: adminRole._id,
  });

  const user = await User.create({
    name: "User",
    email: "user@test.com",
    password: await bcrypt.hash("123456", parseInt(process.env.SALT)),
    role_id: userRole._id,
  });

  userToken = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.name,
      role_id: user.role_id,
      role: userRole.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    process.env.JWT_SECRET_KEY
  );

  adminToken = jwt.sign(
    {
      id: admin._id,
      name: admin.name,
      email: admin.name,
      role_id: admin.role_id,
      role: adminRole.name,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },
    process.env.JWT_SECRET_KEY
  );
});

afterEach(async () => {
  await Organization.deleteMany();
  await User.deleteMany();
  await Role.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/organizations", () => {
  it("should create organization if role is admin", async () => {
    const res = await request(app)
      .post("/api/v1/organizations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Seleris Corp",
        code: "SLC123",
      });


    expect(res.statusCode).toBe(201);
  });

  it("should fail if role is user", async () => {
    const res = await request(app)
      .post("/api/v1/organizations")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Forbidden Org",
        code: "SLC123",
      });

    expect(res.statusCode).toBe(403);
  });

  it("should fail if token is missing", async () => {
    const res = await request(app).post("/api/v1/organizations").send({
      name: "No Token Org",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should fail if payload invalid", async () => {
    const res = await request(app)
      .post("/api/v1/organizations")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });
});
