import { Subscriptions } from "../models/SubscriptionsPlans.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const addPlans = asyncHandler(async (req, res) => {

    const { month, price } = req.body
    console.log(month, price)

    if (
        [month, price].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingMonth = await Subscriptions.findOne({ month })

    if (existingMonth) {
        throw new ApiError(401, "This month is already exist")
    }

    const subsPlan = await Subscriptions.create({
        month,
        price
    })

    if (!subsPlan) {
        throw new ApiError(500, "Something went wrong while adding the plans")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, subsPlan, "Plans added successfully")
        )

})

const getSubscriptionsPlans = asyncHandler(async (req, res) => {
    const getPlans = await Subscriptions.find({}, { month: 1, price: 1 })
       

    if (getPlans) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, getPlans, "Plans fetched successfully")
            )
    }
})
export { addPlans, getSubscriptionsPlans }