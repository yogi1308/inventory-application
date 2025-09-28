const express = require('express')
const {getAllBooks, getAllGenres, getAllAuthors} = require("../db/queries.js")

const router = express.Router()

router.get("/", async (req, res) => {
    const allBooks = await getAllBooks();
    res.render("index", {
        title: "Library Inventory",
        books: allBooks
    });
});

router.get("/genres", async (req, res) => {
    const allGenres = await getAllGenres();
    res.render("genres", {
        title: "Library Inventory",
        genres: allGenres
    });
});

router.get("/author", async (req, res) => {
    const allAuthors = await getAllAuthors();
    console.log(allAuthors)
    res.render("author", {
        title: "Library Inventory",
        authors: allAuthors
    });
});

module.exports = router