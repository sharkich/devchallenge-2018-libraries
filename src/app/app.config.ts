export const APP_CONFIG = {
  url: {
    books: '/assets/api/books.json',
    libraries: '/assets/api/libraries.json',
    books2libraries: '/assets/api/books2libraries.json'
  },
  db: {
    name: 'KL_UA',
    version: 1,
    tables: {
      books: 'books',
      libraries: 'libraries',
      books2libraries: 'books2libraries'
    }
  },
  localStorage: {
    token: 'KL_UA.token'
  }
};
