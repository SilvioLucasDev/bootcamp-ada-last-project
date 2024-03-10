import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { HttpServer } from "../../../src/server";
import { userMock, usersMock } from "../mocks/users";
import request from "supertest";

describe("GET /v1/users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await UsersModel.sequelize?.sync({ force: true });
    await UsersModel.bulkCreate(usersMock);
  });

  function makeSut() {
    const httpServer = new HttpServer();

    httpServer.setup();

    return { app: httpServer.app };
  }

  it("should return all users", async () => {
    const { app } = makeSut();

    const response = await request(app).get("/v1/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body.map((user: any) => user.name)).toEqual(
      usersMock.map((user) => user.name)
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).get("/v1/users");

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});

describe("GET /v1/users/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await UsersModel.sequelize?.sync({ force: true });
    await UsersModel.create(userMock);
  });

  function makeSut() {
    const httpServer = new HttpServer();

    httpServer.setup();

    return { app: httpServer.app };
  }

  it("should return a user by id", async () => {
    const { app } = makeSut();

    const response = await request(app).get(`/v1/users/${userMock.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userMock.name);
    expect(response.body.email).toBe(userMock.email);
  });

  it("should return 204 if user not found", async () => {
    const { app } = makeSut();

    const response = await request(app).get("/v1/users/invalid_id");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).get(`/v1/users/${userMock.id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});
