import { fakerEN } from "@faker-js/faker";
import { BooksRental, NewBooksRental } from "../../../src/controllers/models";

export const newBookRentalMock: NewBooksRental = {
  book_id: fakerEN.string.uuid(),
  user_id: fakerEN.string.uuid(),
  rented_at: fakerEN.date.anytime(),
  rental_time: fakerEN.date.anytime(),
};

export const bookRentalMock: BooksRental = {
  id: fakerEN.string.uuid(),
  book_id: fakerEN.string.uuid(),
  user_id: fakerEN.string.uuid(),
  rented_at: fakerEN.date.anytime(),
  rental_time: fakerEN.date.anytime(),
};

export const booksRentalMock: BooksRental[] = [
  {
    id: fakerEN.string.uuid(),
    book_id: fakerEN.string.uuid(),
    user_id: fakerEN.string.uuid(),
    rented_at: fakerEN.date.anytime(),
    rental_time: fakerEN.date.anytime(),
  },
  {
    id: fakerEN.string.uuid(),
    book_id: fakerEN.string.uuid(),
    user_id: fakerEN.string.uuid(),
    rented_at: fakerEN.date.anytime(),
    rental_time: fakerEN.date.anytime(),
  },
  {
    id: fakerEN.string.uuid(),
    book_id: fakerEN.string.uuid(),
    user_id: fakerEN.string.uuid(),
    rented_at: fakerEN.date.anytime(),
    rental_time: fakerEN.date.anytime(),
  },
];
