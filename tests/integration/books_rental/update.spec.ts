import { BooksModel } from "../../../src/db/models/Books";
import { BooksRentalModel } from "../../../src/db/models/BooksRental";
import { UsersModel } from "../../../src/db/models/Users";
import { sequelize } from "../../../src/db/sequelize";
import { BooksRental } from "../../../src/controllers/models";
import { HttpServer } from "../../../src/server";
import { booksMock } from "../mocks/books";
import { bookRentalMock } from "../mocks/books_rental";
import { usersMock } from "../mocks/users";
import request from "supertest";

describe("PUT /v1/rental/books/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await BooksModel.sequelize?.sync({ force: true });
    await UsersModel.bulkCreate(usersMock);
    await BooksModel.bulkCreate(booksMock);
    await BooksRentalModel.create({
      ...bookRentalMock,
      book_id: booksMock[0].id,
      user_id: usersMock[0].id,
    });
  });

  function makeSut() {
    const httpServer = new HttpServer();

    httpServer.setup();

    return { app: httpServer.app };
  }

  it("should return 404 if book rental with given id does not exist", async () => {
    const { app } = makeSut();

    const response = await request(app)
      .put(`/v1/rental/books/invalid-id`)
      .send({
        book_id: booksMock[1].id,
        user_id: usersMock[1].id,
        rented_at: new Date(),
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      "no rental were found with the provided id!"
    );
  });

  it("should return 409 if book rental with same book already exists", async () => {
    const { app } = makeSut();

    const response = await request(app)
      .put(`/v1/rental/books/${bookRentalMock.id}`)
      .send({ book_id: booksMock[0].id });

    expect(response.status).toBe(409);
    expect(response.body.message).toEqual(
      "there is already a rental with the same book provided!"
    );
  });

  it("should return 500 if some unexpected error happens", async () => {
    const { app } = makeSut();

    jest.spyOn(sequelize, "query").mockImplementationOnce(() => {
      throw new Error("any error");
    });

    const response = await request(app)
      .put(`/v1/rental/books/${bookRentalMock.id}`)
      .send({
        book_id: booksMock[1].id,
        user_id: usersMock[1].id,
        rented_at: new Date(),
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      "something went wrong, try again latter!"
    );
  });

  it("should update a book rental", async () => {
    const { app } = makeSut();

    const response = await request(app)
      .put(`/v1/rental/books/${bookRentalMock.id}`)
      .send({
        book_id: booksMock[1].id,
        user_id: usersMock[1].id,
        rented_at: new Date("2024-03-10T21:11:00.000Z"),
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject<Partial<BooksRental>>({
      id: bookRentalMock.id,
      book_id: booksMock[1].id,
      user_id: usersMock[1].id,
      rented_at: new Date("2024-03-10T21:11:00.000Z").toISOString() as any,
    });
  });
});
