const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Checks the JWT token sent by the frontend. If it is valid, we know who the user is.
function verifyToken(req, res, next) {
  const header = req.headers.authorization; // looks like: "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first" });
  }
  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, JWT_SECRET); // { id, name, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Your session has expired. Please log in again" });
  }
}

// Only lets admins continue
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can do this" });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
