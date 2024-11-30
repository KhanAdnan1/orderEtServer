import express from "express";
import {
  addCategoryToRestaurant,
  getCategoriesForRestaurant,
} from "../controllers/addCategory.controllers.js";

const router = express.Router();

router.post("/:restaurantID/add-category", addCategoryToRestaurant);
router.get("/:restaurantId", getCategoriesForRestaurant);

export default router;
