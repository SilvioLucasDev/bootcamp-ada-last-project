import { BooksModel } from '../../../src/db/models/Books';
import { sequelize } from '../../../src/db/sequelize';
import { HttpServer } from '../../../src/server';
import { bookMock } from '../mocks/books';
import request from 'supertest';

describe("DELETE /books/:id", () => {
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

  it("should delete a book", async () => {
    const { app } = makeSut();

    const response = await request(app).delete(`/v1/books/${bookMock.id}`);

    expect(response.status).toBe(200);
    expect(await BooksModel.findByPk(bookMock.id)).toBeNull();
  });

  it("should return 404 if book not found", async () => {
    const { app } = makeSut();

    const response = await request(app).delete("/v1/books/invalid-id");

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "any book with the id provided was founded!"
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).delete(`/v1/books/${bookMock.id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});