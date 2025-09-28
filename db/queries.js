const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgresql://yogi:Yogi@psql123@localhost:5432/books_inventory",
});

async function getAllBooks() {
  const { rows } = await pool.query("SELECT * FROM books");
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getAllAuthors() {
  const { rows } = await pool.query("SELECT DISTINCT author FROM books");
  return rows;
}

async function getAuthorsBooks(author) {
  const { rows } = await pool.query(`SELECT DISTINCT * FROM books WHERE author = '${author}'`);
  return rows;
}

async function getGenresBooks(genre) {
  const { rows } = await pool.query(`SELECT * FROM books
  INNER JOIN book_genres ON books.id = book_genres.book_id
  WHERE
    book_genres.genre = '${genre}';`);
  return rows;
}

module.exports = {
  getAllBooks, getAllGenres, getAllAuthors, getAuthorsBooks, getGenresBooks
};