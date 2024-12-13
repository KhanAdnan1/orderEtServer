import { Restaurant } from "../models/AddRestaurant.model.js";
import { SalesPerson } from "../models/SalesPerson.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Subscriptions } from "../models/SubscriptionsPlans.model.js";

// const registerRestaurant = asyncHandler(async (req, res) => {
//   const {
//     RestaurantManagerName,
//     RestaurantName,
//     ManagerContact,
//     RestaurantAddress,
//     restaurantAddedBy,
//   } = req.body;

//   if (!restaurantAddedBy) {
//     throw new ApiError(401, "Unauthorized: User information is missing");
//   }

//   if (
//     [
//       RestaurantManagerName,
//       RestaurantName,
//       ManagerContact,
//       RestaurantAddress,
//       restaurantAddedBy,
//     ].some((field) => field?.trim() === "")
//   ) {
//     throw new ApiError(400, "All fields are required");
//   }

//   // Create a new restaurant in the database
//   const restaurant = await Restaurant.create({
//     RestaurantManagerName,
//     RestaurantName,
//     ManagerContact,
//     RestaurantAddress,
//     restaurantAddedBy,
//   });

//   const createdRestaurant = await Restaurant.findById(restaurant._id).populate(
//     "restaurantAddedBy",
//     "salesPersonName"
//   );

//   if (!createdRestaurant) {
//     throw new ApiError(500, "Something went wrong while adding the restaurant");
//   }

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(200, createdRestaurant, "Restaurant added successfully")
//     );
// });

const registerRestaurant = asyncHandler(async (req, res) => {
  const {
    RestaurantManagerName,
    RestaurantName,
    ManagerContact,
    RestaurantAddress,
    restaurantAddedBy,
    planId, // Include planId in the request
  } = req.body;

  if (!restaurantAddedBy || !planId) {
    throw new ApiError(401, "Missing required information: planId or restaurantAddedBy");
  }

  // Check if any field is empty
  if (
    [
      RestaurantManagerName,
      RestaurantName,
      ManagerContact,
      RestaurantAddress,
    ].some((field) => !field?.trim())
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Fetch the subscription plan
  const subscriptionPlan = await Subscriptions.findById(planId);
  if (!subscriptionPlan) {
    throw new ApiError(400, "Invalid subscription plan ID");
  }

  const { month, price } = subscriptionPlan;

  // Calculate subscription dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + month);

  // Create a new restaurant
  const restaurant = await Restaurant.create({
    RestaurantManagerName,
    RestaurantName,
    ManagerContact,
    RestaurantAddress,
    restaurantAddedBy,
    subscription: {
      planId,
      startDate,
      endDate,
      price,
      active: true,
    },
  });

  const createdRestaurant = await Restaurant.findById(restaurant._id)
    .populate("restaurantAddedBy", "salesPersonName")
    .populate("subscription.planId", "month price")
    .lean(); // Use lean for easier manipulation

  if (!createdRestaurant) {
    throw new ApiError(500, "Failed to create restaurant");
  }

  // Format dates to DD-MM-YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  createdRestaurant.subscription.startDate = formatDate(createdRestaurant.subscription.startDate);
  createdRestaurant.subscription.endDate = formatDate(createdRestaurant.subscription.endDate);

  return res
    .status(201)
    .json(new ApiResponse(200, createdRestaurant, "Restaurant added successfully"));
});


const upgradePlan = asyncHandler(async (req, res) => {
  const { restaurantId, planId } = req.body;

  if (!restaurantId || !planId) {
    throw new ApiError(400, "Restaurant ID and plan ID are required.");
  }

  // Find the restaurant
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found.");
  }

  // Find the plan in the Subscriptions collection
  const plan = await Subscriptions.findById(planId);
  if (!plan) {
    throw new ApiError(404, "Plan not found.");
  }

  // Retrieve the additional months from the plan
  const additionalMonths = plan.month; // Assuming the plan schema has a 'month' field
  if (!additionalMonths || additionalMonths <= 0) {
    throw new ApiError(400, "The selected plan does not have a valid duration.");
  }

  // Extend the current end date
  const currentEndDate = new Date(restaurant.subscription.endDate);

  // Handle overflow manually
  const currentYear = currentEndDate.getFullYear();
  const currentMonth = currentEndDate.getMonth();
  const totalMonths = currentMonth + additionalMonths;

  const newYear = currentYear + Math.floor(totalMonths / 12);
  const newMonth = totalMonths % 12;

  const newEndDate = new Date(currentEndDate);
  newEndDate.setFullYear(newYear, newMonth);

  // Update the subscription
  restaurant.subscription.endDate = newEndDate;

  // Save the changes
  await restaurant.save();

  // Respond with the updated subscription
  res.status(200).json(
    new ApiResponse(
      200,
      {
        startDate: restaurant.subscription.startDate.toISOString(),
        endDate: restaurant.subscription.endDate.toISOString(),
        price: restaurant.subscription.price,
        active: restaurant.subscription.active,
      },
      "Subscription upgraded successfully."
    )
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
  // console.log(restaurants);
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

const getAllRestaurants = asyncHandler(async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("restaurantAddedBy", "salesPersonName salesPersonNumber email")
      .exec();

    res.status(200).json({
      success: true,
      message: "Restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
      error: error.message,
    });
  }
});

export { registerRestaurant, getRestaurants, getAllRestaurants,upgradePlan };
