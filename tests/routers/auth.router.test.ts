import { app } from "@/app";
import { AppDataSource } from "@/database";
import supertest from "supertest";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

const AUTH_ROUTE = "/api/v1/auth";

describe("AUTH /api/v1/auth", () => {
  it("POST /login SUCCESS", async () => {
    await supertest(app)
      .post(`${AUTH_ROUTE}/login`)
      .send({
        email: "test@gmail.com",
        password: "password",
      })
      .expect(200);
  });

  it("POST /login UNAUTHORIZED", async () => {
    await supertest(app)
      .post(`${AUTH_ROUTE}/login`)
      .send({
        email: "test@gmail.com",
        password: "wrongpassword",
      })
      .expect(401);
  });

  it("POST /login WRONG FORM FORMAT", async () => {
    await supertest(app)
      .post(`${AUTH_ROUTE}/login`)
      .send({
        email: "wrongemail",
        password: "1",
      })
      .expect(400);
  });
});
