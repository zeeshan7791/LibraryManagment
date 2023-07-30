// routes/bookRoutes.js
const express = require("express");
const bookController = require("../controllers/booksController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/books", requireAuth, bookController.createBook);
router.get("/books", bookController.getAllBooks);
router.get("/books/:bookId/reviews", bookController.getBookReviews);
router.get("/getAllBooksbyISBN", bookController.getAllBooksByQuery);
router.post("/books/:bookId/reviews", requireAuth, bookController.addReview); // New endpoint to add a review
router.delete(
  "/books/:bookId/reviews/:reviewId",
  requireAuth,
  bookController.deleteReview
); // New endpoint to delete a review

module.exports = router;
