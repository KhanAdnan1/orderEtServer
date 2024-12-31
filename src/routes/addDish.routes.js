import express from "express";
import {
  registerDish,
  getDishesByRestaurant,
  removeDish,
} from "../controllers/addDish.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

// POST request to add a new dish
router.post(
  "/add",
  upload.fields([
    {
      name: "dishImage",
      maxCount: 3,
    },
  ]),
  registerDish
),
  // Route to get all dishes for a specific restaurant
  router.get("/restaurant/:restaurantID", getDishesByRestaurant);

// Route to delete a dish
router.delete("/delete/:id", removeDish);

export default router;
