const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async (req, res) => {
  let books;
  try {
    // remember to add exec() to excecute the functions
    books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
  } catch (error) {
    book = [];
  }
  res.render("index", { books: books });
});

module.exports = router;
