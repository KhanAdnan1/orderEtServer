import express from "express";
import {
  addCategoryToRestaurant,
  getCategoriesForRestaurant,
  removeCategory,
} from "../controllers/addCategory.controllers.js";

const router = express.Router();

router.post("/:restaurantID/add-category", addCategoryToRestaurant);
router.get("/:restaurantId", getCategoriesForRestaurant);

//removing a category
router.delete("/delete/:id", removeCategory);

export default router;
