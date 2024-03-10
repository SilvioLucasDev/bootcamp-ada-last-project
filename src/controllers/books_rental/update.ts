import { Request, Response } from "express";
import { IBooksRentalRepository } from "../interfaces";
import { Logger } from "winston";
import { NewBooksRental } from "../models";

export class UpdateBooksRentalController {
  constructor(
    private readonly logger: Logger,
    private readonly booksRentalRepository: IBooksRentalRepository
  ) { }

  public async update(req: Request<any, any, NewBooksRental>, res: Response): Promise<void> {
    const { id } = req.params
    const body = req.body

    try {
      const bookRental = await this.booksRentalRepository.getById(id)
      if (!bookRental) {
        res.status(404).json({ message: 'no rental were found with the provided id!' })
        return
      }

      if (body.book_id) {
        const BookAlreadyRented = await this.booksRentalRepository.getByBookId(body.book_id)
        if (BookAlreadyRented) {
          res.status(409).json({ message: 'there is already a rental with the same book provided!' })
          return
        }
      }

      await this.booksRentalRepository.update(id, body)

      res.status(200).json({ ...bookRental, ...body, })
      return
    } catch (err) {
      this.logger.error({ message: 'error to update book rental', error: err })
      res.status(500).json({ message: 'something went wrong, try again latter!' })
      return
    }
  }
}