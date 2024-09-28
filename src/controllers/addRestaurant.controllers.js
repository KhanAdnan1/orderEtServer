import { Restaurant } from "../models/AddRestaurant.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";



// Controller to register a new restaurant
const registerRestaurant = asyncHandler(async (req, res) => {
    const { RestaurantManagerName, RestaurantName, ManagerContact, RestaurantAddress, restaurantAddedBy } = req.body;

    console.log(RestaurantName, RestaurantManagerName);

    // Validate if all required fields are provided
    if (
        [RestaurantManagerName, RestaurantName, ManagerContact, RestaurantAddress, restaurantAddedBy].some((field) => 
        field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Create a new restaurant in the database
    const restaurant = await Restaurant.create({
        RestaurantManagerName,
        RestaurantName,
        ManagerContact,
        RestaurantAddress,
        restaurantAddedBy
    });

    // Fetch the newly created restaurant
    const createdRestaurant = await Restaurant.findById(restaurant._id).populate('restaurantAddedBy', 'salesPersonName');

    if (!createdRestaurant) {
        throw new ApiError(500, "Something went wrong while adding the restaurant");
    }

    // Return a successful response
    return res.status(200).json(
        new ApiResponse(200, createdRestaurant, "Restaurant added successfully")
    );
});

export { registerRestaurant };
