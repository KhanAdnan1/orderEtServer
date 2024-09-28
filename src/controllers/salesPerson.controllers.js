import { SalesPerson } from "../models/SalesPerson.model.js";
import asyncHandler from "../utils/asyncHandler.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerSalesPerson = asyncHandler(async (req, res) => {
    const { email, salesPersonNumber, salesPersonName, userName, password } = req.body;

    console.log(email, salesPersonNumber)
    if (
        [email, salesPersonNumber, salesPersonName, userName, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All Field are required")
    }

    const existingSalesPerson = await SalesPerson.findOne({
        $or: [{ email }, { userName }]
    })

    if (existingSalesPerson) {
        throw new ApiError(401, "This user is already exist")
    }

    const salesPerson = await SalesPerson.create({
        email,
        salesPersonNumber,
        salesPersonName,
        userName,
        password
    })

    const createdSalesPerson = await SalesPerson.findById(salesPerson._id).select(
        "-password -refreshToken"
    )

    if (!createdSalesPerson) {
        throw new ApiError(500, "Something went wrong while registering the user")

    }
    return res.status(200).json(
        new ApiResponse(200, createdSalesPerson, "User register successfully")
    )
})




export { registerSalesPerson }