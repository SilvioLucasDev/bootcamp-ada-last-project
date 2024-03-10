import { BooksModel } from "../../../src/db/models/Books";
import { BooksRentalModel } from "../../../src/db/models/BooksRental";
import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { HttpServer } from "../../../src/server";
import { bookMock } from "../mocks/books";
import { bookRentalMock } from "../mocks/books_rental";
import { userMock } from "../mocks/users";
import request from "supertest";

describe("DELETE /v1/rental/books/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await BooksRentalModel.sequelize?.sync({ force: true });
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

  it("should delete a book rental", async () => {
    const { app } = makeSut();

    const response = await request(app).delete(`/v1/rental/books/${bookRentalMock.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
    expect(await BooksRentalModel.findByPk(bookRentalMock.id)).toBeNull();
  });

  it("should return 404 if book rental not found", async () => {
    const { app } = makeSut();

    const response = await request(app).delete("/v1/rental/books/invalid-id");

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "any book rental with the id provided was founded!"
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).delete(`/v1/rental/books/${bookRentalMock.id}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});
