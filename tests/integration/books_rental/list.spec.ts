import { BooksModel } from "../../../src/db/models/Books";
import { BooksRentalModel } from "../../../src/db/models/BooksRental";
import { bookMock, booksMock } from "../mocks/books";
import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { Book, User } from "../../../src/controllers/models";
import { HttpServer } from "../../../src/server";
import { booksRentalMock, bookRentalMock } from "../mocks/books_rental";
import { userMock, usersMock } from "../mocks/users";
import request from "supertest";

describe("GET /v1/rental/books", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await BooksModel.sequelize?.sync({ force: true });
    await UsersModel.bulkCreate(usersMock);
    await BooksModel.bulkCreate(booksMock);
    await BooksRentalModel.bulkCreate(
      booksRentalMock.map((book_rental, index) => ({
        ...book_rental,
        user_id: usersMock[index].id,
        book_id: booksMock[index].id,
      }))
    );
  });

  function makeSut() {
    const httpServer = new HttpServer();

    httpServer.setup();

    return { app: httpServer.app };
  }

  it("should return all books rentals", async () => {
    const { app } = makeSut();

    const response = await request(app).get("/v1/rental/books");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(
      response.body.map((book_rental: any) => book_rental.user_id)
    ).toEqual(usersMock.map((user) => user.id));
    expect(
      response.body.map((book_rental: any) => book_rental.book_id)
    ).toEqual(booksMock.map((book) => book.id));
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).get("/v1/rental/books");

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});

describe("GET /v1/rental/books/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await BooksModel.sequelize?.sync({ force: true });
    await UsersModel.create(userMock);
    await BooksModel.create(bookMock);
    await BooksRentalModel.create({
      ...bookRentalMock,
      user_id: userMock.id,
      book_id: bookMock.id,
    });
  });

  function makeSut() {
    const httpServer = new HttpServer();

    httpServer.setup();

    return { app: httpServer.app };
  }

  it("should return a book rental by id", async () => {
    const { app } = makeSut();

    const response = await request(app).get(`/v1/rental/books/${bookRentalMock.id}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject<Partial<User>>({
      ...userMock,
    });
    expect(response.body.book).toMatchObject<Partial<Book>>({
      ...bookMock,
      published_at: bookMock.published_at.toISOString() as any,
    });
  });

  it("should return 204 if book rental not found", async () => {
    const { app } = makeSut();

    const response = await request(app).get("/v1/rental/books/invalid_id");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).get(`/v1/rental/books/${bookRentalMock.id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});
