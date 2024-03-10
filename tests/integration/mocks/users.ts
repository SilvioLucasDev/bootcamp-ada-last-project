import { fakerEN } from "@faker-js/faker";
import { NewUser, User } from "../../../src/controllers/models";

export const newUserMock: NewUser = {
  name: fakerEN.internet.userName(),
  email: fakerEN.internet.email(),
};

export const userMock: User = {
  id: fakerEN.string.uuid(),
  name: fakerEN.internet.userName(),
  email: fakerEN.internet.email(),
};

export const usersMock: User[] = [
  {
    id: fakerEN.string.uuid(),
    name: fakerEN.internet.userName(),
    email: fakerEN.internet.email(),
  },
  {
    id: fakerEN.string.uuid(),
    name: fakerEN.internet.userName(),
    email: fakerEN.internet.email(),
  },
  {
    id: fakerEN.string.uuid(),
    name: fakerEN.internet.userName(),
    email: fakerEN.internet.email(),
  },
];

export const fieldsToUpdateMock: Partial<User> = {
  name: fakerEN.internet.userName(),
  email: fakerEN.internet.email(),
};
