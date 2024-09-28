import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Dish } from "../models/AddDish.model.js";

//Controller to regsiter a new Dish
const registerDish = asyncHandler(async (req,res) => {
    const {dishName,dishCategory,dishPrice,dishOfTheRestaurant}=req.body;

    console.log(dishName,dishOfTheRestaurant);

    //Validate if all required fields are provided
    if (
        [dishName,dishCategory,dishPrice,dishOfTheRestaurant].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400,"All fields are required");
    }

    //Create a new Dish in the database
    const dish = await Dish.create({
        dishName,
        dishCategory,
        dishPrice,
        dishOfTheRestaurant
    });

    // Return a successful response
    return res.status(200).json(
        new ApiResponse(200, dish, "Dish added successfully")
    );
});

export {registerDish};