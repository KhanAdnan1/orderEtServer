import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { SalesPerson } from "../models/SalesPerson.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        

        if (!token) {
            throw new ApiError(401, "Unauthorized reuest")
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const salesPerson = await SalesPerson.findById(decodeToken?._id).select("-password -refreshToken")

        if (!salesPerson) {
            throw new ApiError(401, "Invalid access token")
        }

        req.salesPerson = salesPerson
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "something wet wrong")

    }
})

export { verifyJWT }