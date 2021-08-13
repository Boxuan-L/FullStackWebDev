const express = require("express");
const router = express.Router();
const Author = require("../models/author");

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
    console.log(err);
    res.redirect("/");
  }
});

// New authors
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
    res.redirect("/authors");
  } catch (error) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author",
    });
  }
  // author.save((err, newAuthor) => {
  //   if (err) {
  //     res.render("authors/new", {
  //       author: author,
  //       errorMessage: "Error creating Author",
  //     });
  //   } else {
  //     //res.redirect("/authors/${newAuthor.id}");
  //     res.redirect("/authors");
  //   }
  // });
});

module.exports = router;
