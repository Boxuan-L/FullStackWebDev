const mongoose = require("mongoose");
const path = require("path");

const coverImageBasePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  pageCount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  coverImageName: {
    type: String,
    required: true,
  },
  author: {
    // reference to the id of the author in author model
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // the name that author model exports
    ref: "Author",
  },
});
// it will derive its value from the above values
bookSchema.virtual("coverImagePath").get(function () {
  // use a funtion but not => function, becuase we will use this keyword
  if (this.coverImageName != null) {
    // already add express.static to public folder
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
