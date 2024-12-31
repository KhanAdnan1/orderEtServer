import { Restaurant } from "../models/AddRestaurant.model.js";

export const addCategoryToRestaurant = async (req, res) => {
  const { restaurantID } = req.params;
  const { category } = req.body;

  if (!category || category.trim() === "") {
    return res.status(400).json({ message: "Category cannot be empty." });
  }

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantID,
      { $addToSet: { categories: category } }, // Add category if it doesn't already exist
      { new: true }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.status(200).json({
      message: "Category added successfully.",
      updatedRestaurant,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getCategoriesForRestaurant = async (req, res) => {
  const { restaurantId } = req.params; // Extract restaurantId from request parameters

  try {
    const restaurant = await Restaurant.findById(restaurantId, "categories");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.status(200).json(restaurant.categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

//removing a category

export const removeCategory = async (req, res) => {
  const { restaurantID, categoryName } = req.params;

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required." });
  }

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantID,
      { $pull: { categories: categoryName } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.status(200).json({
      message: "Category removed successfully.",
      updatedRestaurant,
    });
  } catch (error) {
    console.error("Error removing category:", error);
    res.status(500).json({ message: "Failed to remove category." });
  }
};
