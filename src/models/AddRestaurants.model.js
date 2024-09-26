import mongoose, { Schema } from "mongoose";

const addRestaurantsSchema= new mongoose.Schema(
    {


        //Write the remaining schema above
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


