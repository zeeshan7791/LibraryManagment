// controllers/bookController.js
const jwt = require("jsonwebtoken");
const Book = require("../Models/booksModels");
// Controller to handle book creation
// Controller to handle book creation
exports.createBook = async (req, res) => {
  try {
    const { title, ISBN, authorName, reviews } = req.body;
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const newBook = new Book({ title, ISBN, authorName, reviews });
    await newBook.save();

    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error("Error during book creation:", error);
    res.status(500).json({ error: "An error occurred during book creation" });
  }
};
/// getallbooks
exports.getAllBooksByQuery = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books });
  } catch (error) {
    console.error("Error while fetching books:", error);
    res.status(500).json({ error: "An error occurred while fetching books" });
  }
};

// ISBN
exports.getAllBooks = async (req, res) => {
  try {
    const { isbn, author, title } = req.query;

    if (isbn) {
      // If ISBN is provided in the query parameters, find books by ISBN
      const books = await Book.find({ ISBN: isbn });
      res.status(200).json({ books });
    } else if (author) {
      // If author name is provided in the query parameters, find books by author name
      const books = await Book.find({ authorName: author });
      res.status(200).json({ books });
    } else if (title) {
      // If title is provided in the query parameters, find books by title
      const books = await Book.find({
        title: { $regex: title, $options: "i" },
      });
      res.status(200).json({ books });
    } else {
      // If none of the query parameters are provided, return all books
      const books = await Book.find();
      res.status(200).json({ books });
    }
  } catch (error) {
    console.error("Error while fetching books:", error);
    res.status(500).json({ error: "An error occurred while fetching books" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { review } = req.body;
    const { userId } = req.body;

    const bookId = req.params.bookId; // Assuming you pass the book ID in the URL (e.g., '/books/:bookId/reviews')

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Add the review to the book's reviews array with the user ID
    book.reviews.push({ review, userId });
    await book.save();

    res.status(201).json({ message: "Review added successfully", book });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const book = await Book.findOneAndUpdate(
      { "reviews._id": reviewId, "reviews.userId": userId },
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        error:
          "Review not found or you are not authorized to delete this review",
      });
    }

    res.status(200).json({ message: "Review deleted successfully", book });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the review" });
  }
};

// Controller to get reviews for a particular book
exports.getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId)
      .populate("reviews.userId", "username") // Populate the userId and only return the 'username' field
      .select("title reviews"); // Select only the 'title' and 'reviews' fields

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ reviews: book.reviews });
  } catch (error) {
    console.error("Error while fetching book reviews:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching book reviews" });
  }
};
