import { SalesPerson } from "../models/SalesPerson.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

// Login function to authenticate salesperson
const loginSalesPerson = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if both fields are provided
  if (![username, password].every((field) => field?.trim() !== "")) {
    throw new ApiError(400, "Both username and password are required");
  }

  // Find salesperson by username
  const salesPerson = await SalesPerson.findOne({ username });

  if (!salesPerson) {
    throw new ApiError(404, "Salesperson not found!");
  }

  // Compare password with the stored hashed password
  const isMatch = await bcrypt.compare(password, salesPerson.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  // Create JWT token
  const token = jwt.sign(
    { id: salesPerson._id, username: salesPerson.username },
    process.env.JWT_SECRET, // Use your secret key from .env
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  // Return the JWT token in the response
  return res
    .status(200)
    .json(new ApiResponse(200, { token }, "Login successful"));
});

const registerSalesPerson = asyncHandler(async (req, res) => {
  const { email, salesPersonNumber, salesPersonName, username, password } =
    req.body;

  console.log(email, salesPersonNumber, salesPersonName, username, password);
  if (
    [email, salesPersonNumber, salesPersonName, username, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Field are required");
  }

  const existingSalesPerson = await SalesPerson.findOne({
    $or: [{ email }, { username }],
  });

  if (existingSalesPerson) {
    throw new ApiError(401, "This user is already exist");
  }

  const salesPerson = await SalesPerson.create({
    email,
    salesPersonNumber,
    salesPersonName,
    username,
    password,
  });

  const createdSalesPerson = await SalesPerson.findById(salesPerson._id).select(
    "-password -refreshToken"
  );

  if (!createdSalesPerson) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, createdSalesPerson, "User register successfully")
    );
});
export { registerSalesPerson, loginSalesPerson };
