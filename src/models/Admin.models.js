import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const adminSchema = new mongoose.Schema(

    {
        userName: {
            type: String,
            required: true,
            trim: true

        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        refreshToken: {
            type: String
        }
    }
    ,
    {
        timestamps: true
    })

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

adminSchema.methods.generateAccessToken =  function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateRefreshToken =  function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const Admin = mongoose.model("Login", adminSchema);