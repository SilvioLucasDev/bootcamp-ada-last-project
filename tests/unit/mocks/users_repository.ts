import { IUsersRepository } from "../../../src/controllers/interfaces";
import { NewUser, User } from "../../../src/controllers/models";

export const usersRepositoryMock: IUsersRepository = {
  create: (newUser: NewUser): Promise<User> => jest.fn as any,
  getById: (id: string): Promise<User | undefined> => jest.fn as any,
  getByEmail: (email: string): Promise<User | undefined> => jest.fn as any,
  list: (): Promise<User[]> => jest.fn as any,
  update: (id: string, book: NewUser): Promise<void> => jest.fn as any,
  delete: (id: string): Promise<void> => jest.fn as any,
}