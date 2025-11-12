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

// In routes/index.js

router.get("/genres/:genre", async (req, res) => {
  try {
    const allGenresBooks = await getGenresBooks(req.params.genre);
    
    // --- THIS IS THE MISSING FIX (Line 1) ---
    // You must also fetch the list of all genres for the 'add' partial
    const allGenres = await queries.getAllGenres(); // Or whatever your function is named

    res.render("index", {
      title: "Library Inventory",
      books: allGenresBooks,
      searchResultsFor: req.params.genre,
      
      // --- THIS IS THE MISSING FIX (Line 2) ---
      genres: allGenres // Pass the genres list to the template
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
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
    res.render("index", {
        title: "Library Inventory",
        books: allAuthorsBooks,
        searchResultsFor: req.params.author,
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