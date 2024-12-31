import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Dish } from "../models/AddDish.model.js";
import uploadOnCloudinary from "../utils/imageUpload.js";
import fs from "fs";

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
  const uploadedImages = [];
  const dishImageFiles = req.files?.dishImage; // Accessing uploaded files

  if (!dishImageFiles || dishImageFiles.length === 0) {
    throw new ApiError(404, "At least one dish image is required");
  }

  for (const file of dishImageFiles) {
    const dishImageLocalPath = file.path;

    // Upload to Cloudinary
    const uploadedImage = await uploadOnCloudinary(dishImageLocalPath);

    if (uploadedImage) {
      uploadedImages.push(uploadedImage.url); // Store the Cloudinary URL
      fs.unlinkSync(dishImageLocalPath); // Remove the local file after upload
    } else {
      throw new ApiError(500, "Failed to upload one or more images");
    }
  }

  if (uploadedImages.length === 0) {
    throw new ApiError(500, "No images were successfully uploaded");
  }

  //Create a new Dish in the database
  const dish = await Dish.create({
    dishName,
    dishCategory,
    dishPrice,
    dishImage: uploadedImages,
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

//controller to delete a dish
const removeDish = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Dish ID is required");
  }

  // Find and remove the dish
  const dish = await Dish.findByIdAndDelete(id);

  if (!dish) {
    throw new ApiError(404, "Dish not found");
  }

  return res.status(200).json({
    success: true,
    message: "Dish removed successfully",
    data: dish,
  });
});

export { registerDish, getDishesByRestaurant, removeDish };
