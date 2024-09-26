import mongoose, { Schema } from "mongoose";

const addRestaurantsSchema= new mongoose.Schema(
    {

        // Fields for the restaurant
        RestaurantManagerName: {
            type: String,
            required: true,
            trim: true
        },
        RestaurantName: {
            type: String,
            required: true,
            trim: true
        },
        ManagerContact: {
            type: Number,
            required: true,
            trim: true
        },
        RestaurantAddress: {
            type: String,
            required: true,
            trim: true
        },
        restaurantAddedBy:{
            type:Schema.Types.ObjectId,
            ref:"SalesPerson"
        }

    },
    {
        timestamps:true
    }
)

export const Restaurant= mongoose.model("Restaurant",addRestaurantsSchema)


