import express from "express";

import {
  registerRestaurant,
  getRestaurants,
  getAllRestaurants,
  upgradePlan,
  removeRestaurant,
} from "../controllers/addRestaurant.controllers.js"; // Adjust path if necessary
//import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerRestaurant);
router.put("/plans", upgradePlan);

// DELETE: Remove a restaurant
router.delete("/delete/:id", removeRestaurant);

// GET: Fetch all restaurants for the current user
router.get("/", getRestaurants);
router.get("/all", getAllRestaurants);

export default router;
