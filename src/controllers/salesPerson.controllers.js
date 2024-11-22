import { SalesPerson } from "../models/SalesPerson.model.js";
import asyncHandler from "../utils/asyncHandler.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";



// // Login function to authenticate salesperson
// const loginSalesPerson = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;

//   // Check if both fields are provided
//   if (![username, password].every((field) => field?.trim() !== "")) {
//     throw new ApiError(400, "Both username and password are required");
//   }

//   // Find salesperson by username
//   const salesPerson = await SalesPerson.findOne({ username });

//   if (!salesPerson) {
//     throw new ApiError(404, "Salesperson not found!");
//   }

//   // Compare password with the stored hashed password
//   const isMatch = await bcrypt.compare(password, salesPerson.password);

//   if (!isMatch) {
//     throw new ApiError(400, "Invalid credentials");
//   }

//   // Create JWT token
//   const token = jwt.sign(
//     { id: salesPerson._id, username: salesPerson.username },
//     process.env.JWT_SECRET, // Use your secret key from .env
//     { expiresIn: "1h" } // Token expires in 1 hour
//   );

//   // Return the JWT token in the response
//   return res
//     .status(200)
//     .json(new ApiResponse(200, { token }, "Login successful"));
// });


const generateAccessTokenAndRefreshToken = async (salesPersonID) => {
  try {
      const salesPerson = await SalesPerson.findById(salesPersonID)
      const accessToken = salesPerson.generateAccessToken()
      const refreshToken = salesPerson.generateRefreshToken()

      salesPerson.refreshToken = refreshToken

      await salesPerson.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }

  } catch (error) {
      throw new ApiError(500, "Something went wrong ")
  }
}
const registerSalesPerson = asyncHandler(async (req, res) => {
  const { email, salesPersonNumber, salesPersonName, userName, password } =
    req.body;

  console.log(email, salesPersonNumber, salesPersonName, userName, password);
  if (
    [email, salesPersonNumber, salesPersonName, userName, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Field are required");
  }

  const existingSalesPerson = await SalesPerson.findOne({
    $or: [{ email }, { userName }],
  });

  if (existingSalesPerson) {
    throw new ApiError(401, "This user is already exist");
  }

  const salesPerson = await SalesPerson.create({
    email,
    salesPersonNumber,
    salesPersonName,
    userName,
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


const loginSalesPerson = asyncHandler(async (req, res) => {
  let { userName, password } = req.body;
  console.log(userName)

  if (!userName) {
      throw new ApiError(400, "Username and password is required")
  }

  const salesPerson = await SalesPerson.findOne({ userName })

  if (!salesPerson) {
      throw new ApiError(404, "Invalid user credentials")
  }

  const isPasswordValid = await salesPerson.isPasswordCorrect(password)

  if (!isPasswordValid) {
      throw new ApiError(400, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(salesPerson._id)

  const loggedInsalesPerson = await SalesPerson.findById(salesPerson._id).
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
                salesPerson: loggedInsalesPerson, accessToken, refreshToken
              },
              "Admin logged in  successfully"
          )
      )
})

const salesPesonLogout= asyncHandler(async (req, res)=>{
  await SalesPerson.findByIdAndUpdate(
    req.salesPerson._id,
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
        new ApiResponse(200, {}, "Sucessfully  logout")
    )

})

export { registerSalesPerson, loginSalesPerson,salesPesonLogout };
