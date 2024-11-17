import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    throw new ApiError(403, "No token provided. Access denied.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    next(); // Proceed to the next middleware/route
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token.");
  }
};

export { verifyToken };
