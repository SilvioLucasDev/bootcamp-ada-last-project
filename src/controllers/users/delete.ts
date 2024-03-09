import { IUsersRepository } from "../interfaces";
import { Request, Response } from "express";
import { Logger } from "winston";

export class DeleteUsersController {
  constructor(
    private readonly logger: Logger,
    private readonly usersRepository: IUsersRepository,
  ) { }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params

    try {
      const user = await this.usersRepository.getById(id)
      if (!user) {
        res.status(404).json({ message: 'any user with the id provided was founded' })
        return
      }

      await this.usersRepository.delete(id)
      res.status(200).send()
      return
    } catch (err) {
      this.logger.error({ message: 'error to delete user', error: err })
      res.status(500).json({ message: 'something went wrong, try again latter!' })
      return
    }
  }
}