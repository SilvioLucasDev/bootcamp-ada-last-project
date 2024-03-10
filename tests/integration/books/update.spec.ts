import { Book } from "../../../src/controllers/models";
import { BooksModel } from "../../../src/db/models/Books";
import { sequelize } from "../../../src/db/sequelize";
import { HttpServer } from "../../../src/server";
import { bookMock, fieldsToUpdateMock } from "../mocks/books";
import request from "supertest";

describe("PUT /v1/books/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await BooksModel.sequelize?.sync({ force: true });
    await BooksModel.create(bookMock);
  });

  function makeSut() {
    const httpServer = new HttpServer();

    httpServer.setup();

    return { app: httpServer.app };
  }

  it("should return 404 if book with given id does not exist", async () => {
    const { app } = makeSut();

    const response = await request(app).put(`/v1/books/invalid-id`).send(fieldsToUpdateMock);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("no book were found with the given id!");
  });

  it("should return 409 if book with same title already exists", async () => {
    const { app } = makeSut();

    const response = await request(app).put(`/v1/books/${bookMock.id}`).send({ title: bookMock.title });

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual("there is already a book with the same title provided!");
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).put(`/v1/books/${bookMock.id}`).send(fieldsToUpdateMock);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
  
  it("should update a book", async () => {
    const { app } = makeSut();

    const response = await request(app).put(`/v1/books/${bookMock.id}`).send(fieldsToUpdateMock);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject<Partial<Book>>({
      id: bookMock.id,
      ...fieldsToUpdateMock,
    });
  });
});