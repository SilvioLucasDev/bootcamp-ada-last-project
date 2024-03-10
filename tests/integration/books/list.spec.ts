import { BooksModel } from '../../../src/db/models/Books';
import { bookMock, booksMock } from '../mocks/books';
import { HttpServer } from '../../../src/server';
import request from 'supertest';
import { sequelize } from '../../../src/db/sequelize';

describe("GET /v1/books", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await BooksModel.sequelize?.sync({ force: true });
    await BooksModel.bulkCreate(booksMock);
  });

  function makeSut() {
    const httpServer = new HttpServer();

    httpServer.setup();

    return { app: httpServer.app };
  }

  it("should return all books", async () => {
    const { app } = makeSut();

    const response = await request(app).get("/v1/books");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body.map((book: any) => book.title)).toEqual(
      booksMock.map((book) => book.title)
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).get("/v1/books");

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});

describe("GET /v1/books/:id", () => {
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

  it("should return a book by id", async () => {
    const { app } = makeSut();

    const response = await request(app).get(`/v1/books/${bookMock.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(bookMock.title);
    expect(response.body.authors).toBe(bookMock.authors);
  });

  it("should return 204 if book not found", async () => {
    const { app } = makeSut();

    const response = await request(app).get("/v1/books/invalid_id");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).get(`/v1/books/${bookMock.id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});