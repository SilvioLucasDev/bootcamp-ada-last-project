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

    const user = await this.usersRepository.getById(id)
    if (!user) {
      res.status(404).json({ message: 'any user with the id provided was founded' })
      return
    }

    await this.usersRepository.update(id, body)
  }
}