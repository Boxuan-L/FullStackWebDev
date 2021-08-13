const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

// name of table is "Author"
module.exports = mongoose.model("Author", authorSchema);
