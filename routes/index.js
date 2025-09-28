const express = require('express')
const {getAllBooks, getAllGenres, getAllAuthors, getAuthorsBooks, getGenresBooks} = require("../db/queries.js")

const router = express.Router()

router.get("/", async (req, res) => {
    const allBooks = await getAllBooks();
    res.render("index", {
        title: "Library Inventory",
        books: allBooks,
        searchResultsFor: null
    });
});

router.get("/genres", async (req, res) => {
    const allGenres = await getAllGenres();
    res.render("genres", {
        title: "Library Inventory",
        genres: allGenres
    });
});

router.get("/genres/:genre", async (req, res) => {
    console.log(req.params.genre)
    const allGenresBooks = await getGenresBooks(req.params.genre);
    console.log(allGenresBooks)
    res.render("index", {
        title: "Library Inventory",
        books: allGenresBooks,
        searchResultsFor: req.params.genre
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

router.get("/author/:author", async (req, res) => {
    console.log(req.params.author)
    const allAuthorsBooks = await getAuthorsBooks(req.params.author);
    console.log(allAuthorsBooks)
    res.render("index", {
        title: "Library Inventory",
        books: allAuthorsBooks,
        searchResultsFor: req.params.author
    });
});

module.exports = router