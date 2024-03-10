import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { Book } from "../../../src/controllers/models";
import { HttpServer } from "../../../src/server";
import { userMock, fieldsToUpdateMock } from "../mocks/users";
import request from "supertest";

describe("PUT /v1/users/:id", () => {
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

  it("should return 404 if user with given id does not exist", async () => {
    const { app } = makeSut();

    const response = await request(app)
      .put(`/v1/users/invalid-id`)
      .send(fieldsToUpdateMock);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "no user were found with the provided id!"
    );
  });

  it("should return 409 if user with same email already exists", async () => {
    const { app } = makeSut();

    const response = await request(app)
      .put(`/v1/users/${userMock.id}`)
      .send({ email: userMock.email });

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual(
      "there is already a user with the same email provided!"
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app)
      .put(`/v1/users/${userMock.id}`)
      .send(fieldsToUpdateMock);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });

  it("should update a user", async () => {
    const { app } = makeSut();

    const response = await request(app)
      .put(`/v1/users/${userMock.id}`)
      .send(fieldsToUpdateMock);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject<Partial<Book>>({
      id: userMock.id,
      ...fieldsToUpdateMock,
    });
  });
});
