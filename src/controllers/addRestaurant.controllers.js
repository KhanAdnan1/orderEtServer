import { Restaurant } from "../models/AddRestaurant.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const registerRestaurant = asyncHandler(async (req, res) => {
  const {
    RestaurantManagerName,
    RestaurantName,
    ManagerContact,
    RestaurantAddress,
    restaurantAddedBy,
  } = req.body;

  if (!restaurantAddedBy) {
    throw new ApiError(401, "Unauthorized: User information is missing");
  }

  if (
    [
      RestaurantManagerName,
      RestaurantName,
      ManagerContact,
      RestaurantAddress,
      restaurantAddedBy,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Create a new restaurant in the database
  const restaurant = await Restaurant.create({
    RestaurantManagerName,
    RestaurantName,
    ManagerContact,
    RestaurantAddress,
    restaurantAddedBy,
  });

  const createdRestaurant = await Restaurant.findById(restaurant._id).populate(
    "restaurantAddedBy",
    "salesPersonName"
  );

  if (!createdRestaurant) {
    throw new ApiError(500, "Something went wrong while adding the restaurant");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdRestaurant, "Restaurant added successfully")
    );
});

// Controller to fetch restaurants for the current user
const getRestaurants = asyncHandler(async (req, res) => {
  const { salesPersonId } = req.query;

  if (!salesPersonId) {
    throw new ApiError(400, "SalesPerson ID is required");
  }

  // Fetch restaurants by salesPersonId, sorted by date added

  const salesPersonObjectId = new mongoose.Types.ObjectId(salesPersonId);
  const restaurants = await Restaurant.find({
    restaurantAddedBy: salesPersonObjectId,
  }).sort({
    createdAt: -1,
  });
  console.log(restaurants);
  if (restaurants.length === 0) {
    return res.status(404).json({ message: "No restaurants found" });
  }

  return res.status(200).json({
    statusCode: 200,
    data: restaurants,
    message: "Restaurants fetched successfully",
    success: true,
  });
});

export { registerRestaurant, getRestaurants };
