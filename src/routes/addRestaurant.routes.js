import express from "express";

import {
  registerRestaurant,
  getRestaurants,
} from "../controllers/addRestaurant.controllers.js"; // Adjust path if necessary
//import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerRestaurant);

// GET: Fetch all restaurants for the current user
router.get("/", getRestaurants);

export default router;
