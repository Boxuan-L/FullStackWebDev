const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// All authors
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != "") {
    // i represents case insensitive
    // RegExp search for part of the text inside of the field
    // in the simplest case. If you pass jo, it will still be
    // able to search the name that contains jo
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    // if no error, send searchOption to view and render it in input field
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (err) {
    res.redirect("/");
  }
});

// New authors
// the program will search route from top to bottom.
// so make sure to put the route that has :id after the normal route
// otherwise it will treat the word as id
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create new author
router.post("/new", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`/authors/${newAuthor.id}`);
  } catch (error) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    // remember to use exec() function after limit()
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (error) {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    // there are two places that might have error
    // this is for the findById function
    if (author == null) {
      res.redirect("/");
    } else {
      // if the author does exist, then this is for the save method
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error Updating Author",
      });
    }
  }
});

// never use get for deleting. Because search engine will
// click on every get. This will accidently delete everythihg
router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect(`/authors`);
  } catch (error) {
    // there are two places that might have error
    // this is for the findById function
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
