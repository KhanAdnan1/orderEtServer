import express from "express";
import {
  registerDish,
  getDishesByRestaurant,
} from "../controllers/addDish.controller.js";

const router = express.Router();

// POST request to add a new dish
router.post("/add", registerDish);
// Route to get all dishes for a specific restaurant
router.get("/restaurant/:restaurantID", getDishesByRestaurant);

export default router;
