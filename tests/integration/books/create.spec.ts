import { BooksModel } from '../../../src/db/models/Books';
import { sequelize } from '../../../src/db/sequelize';
import { HttpServer } from '../../../src/server';
import { bookMock, newBookMock } from '../mocks/books';
import request from 'supertest';

describe("POST /v1/books", () => {
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

  it("should create a new book and return the correctly values", async () => {
    const { app } = makeSut();

    const response = await request(app).post("/v1/books").send(newBookMock);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("publishing_company");
    expect(response.body.authors).toEqual(newBookMock.authors);
  });

  it("should return 409 if the book already exists", async () => {
    const { app } = makeSut();

    const response = await request(app).post("/v1/books").send(bookMock);

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual(
      "book with the same title already exists!"
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).post("/v1/books").send({});

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});