const mongoose = require("mongoose");

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
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
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
  // take the Buffer data and use it as the actual source of the image
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});

module.exports = mongoose.model("Book", bookSchema);
