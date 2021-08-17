const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// check if there is any book associated with the deleting author
authorSchema.pre("remove", function (next) {
  Book.find({ author: this.id }, (err, books) => {
    // if can't connect to mongodb
    if (err) next(err);
    else if (books.length > 0) next(new Error("This Author has books still"));
    // everything is ok
    else next();
  });
});

// name of table is "Author"
module.exports = mongoose.model("Author", authorSchema);
