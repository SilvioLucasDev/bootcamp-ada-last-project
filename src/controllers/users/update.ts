import { IUsersRepository } from "../interfaces";
import { Request, Response } from "express";
import { Logger } from "winston";
import { NewUser } from "../models";

export class UpdateUsersController {
  constructor(
    private readonly logger: Logger,
    private readonly usersRepository: IUsersRepository
  ) { }

  public async update(req: Request<any, any, NewUser>, res: Response): Promise<void> {
    const { id } = req.params
    const body = req.body

    try {
      const user = await this.usersRepository.getById(id)
      if (!user) {
        res.status(404).json({ message: 'no user were found with the provided id!' })
        return
      }

      if (body.email) {
        const withTheSameEmail = await this.usersRepository.getByEmail(body.email)
        if (withTheSameEmail) {
          res.status(409).json({ message: 'there is already a user with the same email provided!' })
          return
        }
      }

      await this.usersRepository.update(id, body)

      res.status(200).json({ ...user, ...body, })
      return
    } catch (err) {
      this.logger.error({ message: 'error to update user', error: err })
      res.status(500).json({ message: 'something went wrong, try again latter!' })
      return
    }
  }
}