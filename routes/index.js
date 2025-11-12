const express = require('express')
const { body, validationResult } = require("express-validator");
const {getAllBooks, getAllGenres, getAllAuthors, getAuthorsBooks, getGenresBooks, getBookDetails, addBook, deleteBook, updateBookDetails} = require("../db/queries.js")

const router = express.Router()
let allGenres;

router.get("/", async (req, res) => {
    const allBooks = await getAllBooks();
    allGenres = await getAllGenres();
    res.render("index", {
        title: "Library Inventory",
        books: allBooks,
        searchResultsFor: null,
        genres: allGenres,
    });
});

router.get("/genres", async (req, res) => {
    res.render("genres", {
        title: "Library Inventory",
        genres: allGenres
    });
});

router.get("/genres/:genre", async (req, res) => {
    // You need to get BOTH the filtered books AND the list of all genres
    const allGenresBooks = await getGenresBooks(req.params.genre);
    const allGenres = await getAllGenres(); // <--- ADD THIS LINE

    res.render("index", {
        title: "Library Inventory",
        books: allGenresBooks,
        searchResultsFor: req.params.genre,
        genres: allGenres, // <--- AND ADD THIS LINE
    });
});

router.get("/author", async (req, res) => {
    const allAuthors = await getAllAuthors();
    res.render("author", {
        title: "Library Inventory",
        authors: allAuthors
    });
});

router.get("/author/:author", async (req, res) => {
    const allAuthorsBooks = await getAuthorsBooks(req.params.author);
    const allAuthors = await getAllAuthors();
    res.render("index", {
        title: "Library Inventory",
        books: allAuthorsBooks,
        searchResultsFor: req.params.author,
        authors: allAuthors
    });
});

router.get("/book/:book", async (req, res) => {
    const allBookDetails = await getBookDetails(req.params.book);
    res.render("book-details", {
        title: "Library Inventory",
        details: allBookDetails[0],
    });
});

router.post("/add", async (req, res) => {
    try {
        await addBook(req.body);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding book");
    }
})

router.get("/delete-book/:id", async (req, res) => {
    await deleteBook(req.params.id);
    res.redirect("/")
});

router.post("/edit", async (req, res) => {
    try {
        await updateBookDetails(req.body);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating book details");
    }
})

module.exports = router