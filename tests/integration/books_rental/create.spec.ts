import { BooksModel } from "../../../src/db/models/Books";
import { BooksRentalModel } from "../../../src/db/models/BooksRental";
import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { HttpServer } from "../../../src/server";
import { bookMock, newBookMock } from "../mocks/books";
import { bookRentalMock, newBookRentalMock } from "../mocks/books_rental";
import { newUserMock, userMock } from "../mocks/users";
import request from "supertest";

describe("POST /v1/rental/books", () => {
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

  it("should create a new book rental and return the correctly values", async () => {
    const { app } = makeSut();

    const newUser = await request(app).post("/v1/users").send(newUserMock);

    const newBook = await request(app).post("/v1/books").send(newBookMock);

    const response = await request(app)
      .post("/v1/rental/books")
      .send({
        ...newBookRentalMock,
        user_id: newUser.body.id,
        book_id: newBook.body.id,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("book_id", newBook.body.id);
    expect(response.body).toHaveProperty("user_id", newUser.body.id);
    expect(new Date(response.body.rented_at)).toEqual(
      newBookRentalMock.rented_at
    );
  });

  it("should return 409 if the book rental already exists", async () => {
    const { app } = makeSut();

    const response = await request(app)
      .post("/v1/rental/books")
      .send({ ...bookRentalMock, user_id: userMock.id, book_id: bookMock.id });

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual("book already rented!");
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app).post("/v1/rental/books").send({});

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });
});
