import dotenv from 'dotenv'
import express, { Express } from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan'
import winston, { Logger } from 'winston';

import { Routes } from './routes';
import { BooksRepository } from './repositories/books';
import { UsersRepository } from './repositories/users';
import { BooksRentalRepository } from './repositories/books_rental';
import { CreateBooksController } from './controllers/books/create';
import { ReadBooksController } from './controllers/books/read';
import { UpdateBooksController } from './controllers/books/update';
import { DeleteBooksController } from './controllers/books/delete';
import { CreateUsersController } from './controllers/users/create';
import { ReadUsersController } from './controllers/users/read';
import { UpdateUsersController } from './controllers/users/update';
import { DeleteUsersController } from './controllers/users/delete';
import { CreateBooksRentalController } from './controllers/books_rental/create';
import { ReadBooksRentalController } from './controllers/books_rental/read';
import { UpdateBooksRentalController } from './controllers/books_rental/update';
import { DeleteBooksRentalController } from './controllers/books_rental/delete';

export class HttpServer {
  private _app: Express;
  private _logger: Logger;
  private readonly PORT: number | string;

  constructor() {
    this._app = express();
    const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
    dotenv.config({ path: envFile });

    this._logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
      transports: [new winston.transports.Console()]
    });

    this.PORT = process.env.PORT || 3000;
  }

  public setup(): void {
    this._app.use(morgan("dev", { stream: { write: (message) => this._logger.info(message) } }));
    this._app.use(express.json());
    this._app.use(helmet());
    this._app.use(cors());

    const booksRepository = new BooksRepository()
    const usersRepository = new UsersRepository()
    const booksRentalRepository = new BooksRentalRepository()

    const createBooksController = new CreateBooksController(this._logger, booksRepository)
    const readBooksController = new ReadBooksController(this._logger, booksRepository)
    const updateBooksController = new UpdateBooksController(this._logger, booksRepository)
    const deleteBooksController = new DeleteBooksController(this._logger, booksRepository)

    const createUsersController = new CreateUsersController(this._logger, usersRepository)
    const readUsersController = new ReadUsersController(this._logger, usersRepository)
    const updateUsersController = new UpdateUsersController(this._logger, usersRepository)
    const deleteUsersController = new DeleteUsersController(this._logger, usersRepository)

    const createBooksRentalController = new CreateBooksRentalController(this._logger, booksRentalRepository)
    const readBooksRentalController = new ReadBooksRentalController(this._logger, booksRentalRepository)
    const updateBooksRentalController = new UpdateBooksRentalController(this._logger, booksRentalRepository)
    const deleteBooksRentalController = new DeleteBooksRentalController(this._logger, booksRentalRepository)

    this._app.use(
      Routes({
        createBooksController,
        readBooksController,
        updateBooksController,
        deleteBooksController,
        createUsersController,
        readUsersController,
        updateUsersController,
        deleteUsersController,
        createBooksRentalController,
        readBooksRentalController,
        updateBooksRentalController,
        deleteBooksRentalController,
      })
    );
  }

  public start(): void {
    this._app.listen(this.PORT, () => {
      this._logger.info({ message: 'Server started!' });
    });
  }

  get app(): Express {
    return this._app;
  }
}