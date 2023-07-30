// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Store the userId in the request for further use
    req.userId = decodedToken.userId;
    next();
  });
};

module.exports = { requireAuth };
