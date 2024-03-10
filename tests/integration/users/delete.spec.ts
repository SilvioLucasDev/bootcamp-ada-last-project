import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { HttpServer } from "../../../src/server";
import { userMock } from "../mocks/users";
import request from "supertest";

describe("DELETE /users/:id", () => {
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

  it("should delete a user", async () => {
    const { app } = makeSut();

    const response = await request(app).delete(`/v1/users/${userMock.id}`);

    expect(response.status).toBe(200);
    expect(await UsersModel.findByPk(userMock.id)).toBeNull();
  });

  it("should return 404 if user not found", async () => {
    const { app } = makeSut();

    const response = await request(app).delete("/v1/users/invalid-id");

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "any user with the id provided was founded!"
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).delete(`/v1/users/${userMock.id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});
