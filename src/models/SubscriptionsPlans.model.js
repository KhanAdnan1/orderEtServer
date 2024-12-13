import mongoose from "mongoose";

const addPlansSchema = new mongoose.Schema(

    {
        month: {
            type: Number,
            default: 0,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            default: 0,
            required: true,
            trim: true,
        }

    },
    {
        timestamps: true
    }
)
export const Subscriptions = mongoose.model("Plans", addPlansSchema);