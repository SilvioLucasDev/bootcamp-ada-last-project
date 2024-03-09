import { DeleteUsersController } from '../../../src/controllers/users/delete'
import { logger } from '../../mocks/logger'
import { usersRepositoryMock } from '../../mocks/users_repository'
import { User, NewUser } from '../../../src/controllers/models'
import { fakerEN } from '@faker-js/faker'
import { Request, Response } from 'express'

describe('DeleteBooksController', () => {
  function makeSut() {
    const controller = new DeleteUsersController(logger, usersRepositoryMock)

    const newUserMock: NewUser = {
      name: fakerEN.internet.userName(),
      email: fakerEN.internet.email(),
    }

    const userMock: User = {
      id: fakerEN.string.uuid(),
      ...newUserMock
    }

    const requestMock = {
      body: newUserMock,
      params: { id: userMock.id } as any
    } as Request

    const responseMock = {
      statusCode: 0,
      status: jest.fn().mockImplementation((status: number) => {
        responseMock.statusCode = status;
        return responseMock;
      }),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;

    return {
      controller, newUserMock, userMock, requestMock, responseMock
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should delete the user if the user exist', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockResolvedValueOnce(userMock)
    jest.spyOn(usersRepositoryMock, 'delete').mockResolvedValueOnce()

    const promise = controller.delete(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(usersRepositoryMock.delete).toHaveBeenCalledWith(userMock.id)
    expect(usersRepositoryMock.delete).toHaveBeenCalledTimes(1)
    expect(responseMock.statusCode).toEqual(200)
  })

  it('should not delete the user if there is no user with the id provided', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockResolvedValueOnce(undefined)
    jest.spyOn(usersRepositoryMock, 'delete')

    const promise = controller.delete(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(responseMock.json).toHaveBeenCalledWith({ message: 'any user with the id provided was founded!' })
    expect(usersRepositoryMock.delete).not.toHaveBeenCalled()
    expect(responseMock.statusCode).toEqual(404)
  })

  it('should return 500 if some error occur', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockRejectedValueOnce(new Error('some error'))
    jest.spyOn(usersRepositoryMock, 'delete')

    const promise = controller.delete(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(usersRepositoryMock.delete).not.toHaveBeenCalled()
    expect(responseMock.json).toHaveBeenCalledWith({ message: 'something went wrong, try again latter!' })
    expect(responseMock.statusCode).toEqual(500)
  })
})