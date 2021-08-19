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
    const newBook = await book.save();
    //
    res.redirect(`/books/${newBook.id}`);
  } catch {
    renderNewPage(res, book, true);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // populate means it will populate the author variable
    // inside of the book obj with all the information. instead
    // of an id, it will be an obj.
    const book = await Book.findById(req.params.id).populate("author").exec();
    res.render("books/show", { book: book });
  } catch (error) {}
});

// Edit Book
router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (error) {
    res.redirect("/");
  }
});

// Update book
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    // don't want to replace the old cover if the user
    // doesn't pass a new one.
    if (req.body.cover != null && req.body.cover != "") {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch {
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect("/books");
  } catch (error) {
    // not able to delete
    if (book != null) {
      res.render("books/show", {
        book: book,
        errorMessage: "Could not remove book",
      });
      // not able to find book
    } else {
      res.redirect("/");
    }
  }
});

async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "new", hasError);
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "edit", hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) {
      if (form === "edit") {
        params.errorMessage = "Error Updating Book";
      } else if (form === "new") {
        params.errorMessage = "Error Creating Book";
      }
    }
    res.render(`books/${form}`, params);
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
