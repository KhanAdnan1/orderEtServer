import { Subscriptions } from "../models/SubscriptionsPlans.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addPlans = asyncHandler(async (req, res) => {
  const { month, price } = req.body;
  console.log(month, price);

  if ([month, price].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingMonth = await Subscriptions.findOne({ month });

  if (existingMonth) {
    throw new ApiError(401, "This month is already exist");
  }

  const subsPlan = await Subscriptions.create({
    month,
    price,
  });

  if (!subsPlan) {
    throw new ApiError(500, "Something went wrong while adding the plans");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subsPlan, "Plans added successfully"));
});

const getSubscriptionsPlans = asyncHandler(async (req, res) => {
  const getPlans = await Subscriptions.find({}, { month: 1, price: 1 });

  if (getPlans) {
    return res
      .status(200)
      .json(new ApiResponse(200, getPlans, "Plans fetched successfully"));
  }
});
//update existing plan
const updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { month, price } = req.body;

  if (!month && !price) {
    throw new ApiError(
      400,
      "At least one field (month or price) must be provided"
    );
  }

  const plan = await Subscriptions.findById(id);

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  if (month) plan.month = month;
  if (price) plan.price = price;

  await plan.save();

  res.status(200).json(new ApiResponse(200, plan, "Plan updated successfully"));
});

//remove a plan
const removePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Plan ID is required");
  }

  // Find the plan by ID
  const plan = await Subscriptions.findById(id);

  if (!plan) {
    throw new ApiError(404, "Plan not found");
  }

  // Delete the plan using deleteOne
  await plan.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Plan deleted successfully"));
});
export { addPlans, getSubscriptionsPlans, updatePlan, removePlan };
