import { Restaurant } from "../models/AddRestaurant.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


const registerRestaurant = asyncHandler(async (req, res) => {
    const {
        RestaurantManagerName,
        RestaurantName,
        ManagerContact,
        RestaurantAddress,
        restaurantAddedBy
    } = req.body;
    if (!restaurantAddedBy) {
        throw new ApiError(401, "Unauthorized: User information is missing");
    }
    console.log("restaurant added by: ", restaurantAddedBy);

    console.log(RestaurantName, RestaurantManagerName, restaurantAddedBy);
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

    const createdRestaurant = await Restaurant.findById(restaurant._id).populate('restaurantAddedBy', 'salesPersonName');
    if (!createdRestaurant) {
        throw new ApiError(500, "Something went wrong while adding the restaurant");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdRestaurant, "Restaurant added successfully")
        );
});

export { registerRestaurant };

