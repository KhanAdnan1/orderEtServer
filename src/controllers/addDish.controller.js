import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Dish } from "../models/AddDish.model.js";

//Controller to regsiter a new Dish
const registerDish = asyncHandler(async (req, res) => {
  const { dishName, dishCategory, dishPrice, dishOfTheRestaurant } = req.body;

  console.log(dishName, dishOfTheRestaurant);

  //Validate if all required fields are provided
  if (
    [dishName, dishCategory, dishPrice, dishOfTheRestaurant].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingDish = await Dish.findOne({
    dishName: dishName.trim(),
    dishOfTheRestaurant,
  });

  if (existingDish) {
    throw new ApiError(409, "Dish already exists for this restaurant");
  }

  //Create a new Dish in the database
  const dish = await Dish.create({
    dishName,
    dishCategory,
    dishPrice,
    dishOfTheRestaurant,
  });

  // Return a successful response
  return res
    .status(200)
    .json(new ApiResponse(200, dish, "Dish added successfully"));
});

// Controller to get all dishes for a specific restaurant
const getDishesByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantID } = req.params;

  // Fetch all dishes belonging to the restaurant
  const dishes = await Dish.find({ dishOfTheRestaurant: restaurantID });

  //   if (!dishes || dishes.length === 0) {
  //     throw new ApiError(404, "No dishes found for this restaurant");
  //   }

  return res
    .status(200)
    .json(new ApiResponse(200, dishes, "Dishes fetched successfully"));
});

export { registerDish, getDishesByRestaurant };
