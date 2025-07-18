import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.models.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        

        if (!token) {
            throw new ApiError(401, "Unauthorized reuest")
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const admin = await Admin.findById(decodeToken?._id).select("-password -refreshToken")

        if (!admin) {
            throw new ApiError(401, "Invalid access token")
        }

        req.admin = admin
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "something wet wrong")

    }
})

export { verifyJWT }