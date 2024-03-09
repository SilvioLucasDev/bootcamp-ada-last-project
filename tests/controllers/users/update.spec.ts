import { UpdateUsersController } from '../../../src/controllers/users/update'
import { logger } from '../../mocks/logger'
import { usersRepositoryMock } from '../../mocks/users_repository'
import { User, NewUser } from '../../../src/controllers/models'
import { fakerEN } from '@faker-js/faker'
import { Request, Response } from 'express'

describe('UpdateUsersController', () => {
  function makeSut() {
    const controller = new UpdateUsersController(logger, usersRepositoryMock)

    const newUserMock: NewUser = {
      email: fakerEN.internet.email(),
      name: fakerEN.internet.userName(),
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

  it('should return 404 statusCode and not update the user if there is no user with the id provided', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockResolvedValueOnce(undefined)
    jest.spyOn(usersRepositoryMock, 'update').mockResolvedValueOnce()

    const promise = controller.update(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(usersRepositoryMock.update).toHaveBeenCalledTimes(0)
    expect(responseMock.statusCode).toEqual(404)
  })


  it('should return 409 statusCode and not update the user if there is an user with the same email', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockResolvedValueOnce({ ...userMock, email: 'any_email@email.com' })
    jest.spyOn(usersRepositoryMock, 'getByEmail').mockResolvedValueOnce(userMock)
    jest.spyOn(usersRepositoryMock, 'update').mockResolvedValueOnce()

    const promise = controller.update(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(usersRepositoryMock.getByEmail).toHaveBeenCalledWith(userMock.email)
    expect(usersRepositoryMock.update).toHaveBeenCalledTimes(0)
    expect(responseMock.statusCode).toEqual(409)
  })

  it('should return 500 if some error occur', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockRejectedValueOnce(new Error('some error'))

    const promise = controller.update(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(responseMock.json).toHaveBeenCalledWith({ message: 'something went wrong, try again latter!' })
    expect(responseMock.statusCode).toEqual(500)
  })

  it('should update and return user if the user was funded and if there is no other user with the same email', async () => {
    const { controller, userMock, requestMock, responseMock } = makeSut()
    jest.spyOn(usersRepositoryMock, 'getById').mockResolvedValueOnce(userMock)
    jest.spyOn(usersRepositoryMock, 'getByEmail').mockResolvedValueOnce(undefined)
    jest.spyOn(usersRepositoryMock, 'update').mockResolvedValueOnce()

    const promise = controller.update(requestMock, responseMock)

    await expect(promise).resolves.not.toThrow()
    expect(usersRepositoryMock.getById).toHaveBeenCalledWith(userMock.id)
    expect(usersRepositoryMock.getByEmail).toHaveBeenCalledTimes(0)
    expect(usersRepositoryMock.update).toHaveBeenCalledTimes(1)
    expect(responseMock.statusCode).toEqual(200)
  })
})