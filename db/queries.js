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

module.exports = {
  getAllBooks, getAllGenres, getAllAuthors
};