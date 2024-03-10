import { fakerEN } from '@faker-js/faker';
import { Book, NewBook } from '../../../src/controllers/models';

export const newBookMock: NewBook = {
  title: fakerEN.word.words(),
  subtitle: fakerEN.word.words(),
  publishing_company: fakerEN.company.name(),
  published_at: fakerEN.date.anytime(),
  authors: fakerEN.person.firstName(),
}

export const bookMock: Book = {
  id: fakerEN.string.uuid(),
  title: fakerEN.word.words(),
  subtitle: fakerEN.word.words(),
  publishing_company: fakerEN.company.name(),
  published_at: fakerEN.date.anytime(),
  authors: fakerEN.person.firstName(),
}

export const booksMock: Book[] = [
  {
    id: fakerEN.string.uuid(),
    title: fakerEN.word.words(),
    subtitle: fakerEN.word.words(),
    publishing_company: fakerEN.company.name(),
    published_at: fakerEN.date.anytime(),
    authors: fakerEN.person.firstName(),
  },
  {
    id: fakerEN.string.uuid(),
    title: fakerEN.word.words(),
    subtitle: fakerEN.word.words(),
    publishing_company: fakerEN.company.name(),
    published_at: fakerEN.date.anytime(),
    authors: fakerEN.person.firstName(),
  },
  {
    id: fakerEN.string.uuid(),
    title: fakerEN.word.words(),
    subtitle: fakerEN.word.words(),
    publishing_company: fakerEN.company.name(),
    published_at: fakerEN.date.anytime(),
    authors: fakerEN.person.firstName(),
  },
]

export const fieldsToUpdateMock: Partial<Book> = {
  title: fakerEN.word.words(),
  authors: fakerEN.person.firstName(),
}