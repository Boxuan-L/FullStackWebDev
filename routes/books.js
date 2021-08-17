const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

// buildt in library innode
const imageMimeType = ["image/jpeg", "image/png", "image/gif"];

// All books
router.get("/", async (req, res) => {
  let query = Book.find();

  // filter by title
  if (req.query.title != null && req.query.title != "") {
    // similar to RegEx in author.js
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  // filter by publish time
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    // lte selects the documents where the value of the field is
    // less than or equal to (i.e. <=) the specified value.
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    // instead of await for book.find({})
    const books = await query.exec();
    console.log(req.query);
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New book
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create new book
router.post("/new", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });

  saveCover(book, req.body.cover);

  try {
    // remember to add wait before book.save()
    const newBook = await book.save();
    //
    res.redirect("/books");
  } catch {
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error creating book";
    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeType.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
