const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgresql://yogi:Yogi@psql123@localhost:5432/books_inventory",
});

async function getAllBooks() {
  const { rows } = await pool.query("SELECT title, cover FROM books ORDER BY id");
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT DISTINCT name FROM genres");
  return rows;
}

async function getAllAuthors() {
  const { rows } = await pool.query("SELECT DISTINCT author FROM books");
  return rows;
}

async function getAuthorsBooks(author) {
  const { rows } = await pool.query('SELECT DISTINCT * FROM books WHERE author = $1', [author])
  return rows;
}

async function getGenresBooks(genre) {
  const { rows } = await pool.query(`SELECT * FROM books
  INNER JOIN book_genres ON books.id = book_genres.book_id
  WHERE
    book_genres.genre = $1;`, [genre]);
  return rows;
}

async function getBookDetails(book) {
  const { rows } = await pool.query('SELECT * FROM books WHERE title = $1', [book]);
  return rows;
}

module.exports = {
  getAllBooks, getAllGenres, getAllAuthors, getAuthorsBooks, getGenresBooks, getBookDetails
};