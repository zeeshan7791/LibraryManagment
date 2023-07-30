// models/bookModel.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ISBN: { type: String, unique: true, required: true },
  authorName: { type: String, required: true },
  reviews: { type: [reviewSchema], default: [] },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
