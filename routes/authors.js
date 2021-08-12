const express = require("express");
const router = express.Router();

// All authors
router.get("/", (req, res) => {
  res.render("authors/index");
});

// New authors
router.get("/new", (req, res) => {
  res.render("authors/new");
});

// Create new author
router.post("/new", (req, res) => {
  res.send("Create");
});

module.exports = router;
