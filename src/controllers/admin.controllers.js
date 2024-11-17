import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Admin } from "../models/Admin.models.js";



const generateAccessTokenAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken

        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong ")
    }
}


const adminRegister = asyncHandler(async (req, res) => {
    let { userName, password } = req.body;



    if (!userName & !password) {
        throw new ApiError(400, "All Field are required")
    }

    const existingAdmin = await Admin.findOne({ userName })

    if (existingAdmin) {
        throw new ApiError(401, "This admin is already exist")
    }

    const admin = await Admin.create({
        userName,
        password
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin")

    }
    return res.status(200).json(
        new ApiResponse(200, createdAdmin, "admin register successfully")
    )
})

const adminLogin = asyncHandler(async (req, res) => {
    let { userName, password } = req.body;


    if (!userName) {
        throw new ApiError(400, "Username and password is required")
    }

    const admin = await Admin.findOne({ userName })

    if (!admin) {
        throw new ApiError(404, "Invalid user credentials")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).
        select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin, accessToken, refreshToken
                },
                "Admin logged in  successfully"
            )
        )
})

const adminLogout = asyncHandler(async (req, res) => {

    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "Admin logout")
        )

})

export { adminRegister, adminLogin, adminLogout }