import { Book, BooksRental, NewBook, NewBooksRental, NewUser, User } from "./models";

export interface IUsersRepository {
  create(newUser: NewUser): Promise<User>
  getById(id: string): Promise<User | undefined>
  getByEmail(email: string): Promise<User | undefined>
  list(): Promise<User[]>
  update(id: string, user: NewUser): Promise<void>
}

export interface IBooksRepository {
  create(newBook: NewBook): Promise<Book>
  getById(id: string): Promise<Book | undefined>
  getByTitle(title: string): Promise<Book | undefined>
  list(): Promise<Book[]>
  update(id: string, book: NewBook): Promise<void>
  delete(id: string): Promise<void>
}

export interface IBooksRentalRepository {
  create(newBookRental: NewBooksRental): Promise<BooksRental>
  getById(id: string): Promise<BooksRental | undefined>
  getByBookId(id: string): Promise<BooksRental | undefined>
  list(): Promise<BooksRental[]>
  update(id: string, bookRental: NewBooksRental): Promise<void>
  delete(id: string): Promise<void>
}
