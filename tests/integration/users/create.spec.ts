import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { HttpServer } from "../../../src/server";
import { userMock, newUserMock } from "../mocks/users";
import request from "supertest";

describe("POST /v1/users", () => {
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

  it("should create a new user and return the correctly values", async () => {
    const { app } = makeSut();

    const response = await request(app).post("/v1/users").send(newUserMock);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body.email).toEqual(newUserMock.email);
  });

  it("should return 409 if the user already exists", async () => {
    const { app } = makeSut();

    const response = await request(app).post("/v1/users").send(userMock);

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual(
      "user with the same email already exists!"
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).post("/v1/users").send({});

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});
