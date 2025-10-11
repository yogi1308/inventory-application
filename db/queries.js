const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgresql://yogi:Yogi@psql123@localhost:5432/books_inventory",
});

async function getAllBooks() {
  const { rows } = await pool.query("SELECT id, title, cover FROM books ORDER BY id");
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

async function updateBookDetails(details) {
  const { title, author, length, rating, copies, volumes, series, synopsis, cover } = details;
  const lengthType = details['length-type'];
  console.log(details)

  const query = `
    INSERT INTO books (title, author, length, length_type, rating, copies, volumes, series, synopsis, cover)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id;
  `;

  const values = [title, author, length, lengthType, rating, copies, volumes, series, synopsis, cover];
  const returnId = await pool.query(query, values);

  if (details.genre !== '') {
    const genres = details.genre.split(',')
    for (const genre of genres) {
      console.log(genre)
      const queryGenre = `
      INSERT INTO book_genres (book_id, genre_id, genre, title)
      VALUES
        ($1, (SELECT id FROM genres WHERE name = $2), $2, $3);
      `
      await pool.query(queryGenre, [returnId.rows[0].id, genre, title])
    }
  }
}

async function deleteBook(id) {
  await pool.query("DELETE FROM books WHERE id = $1;", [id]);
}

module.exports = {
  getAllBooks, getAllGenres, getAllAuthors, getAuthorsBooks, getGenresBooks, getBookDetails, updateBookDetails, deleteBook
};