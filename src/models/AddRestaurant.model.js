import mongoose from "mongoose";

const addRestaurantsSchema = new mongoose.Schema(
  {
    // Fields for the restaurant
    RestaurantManagerName: {
      type: String,
      required: true,
      trim: true,
    },
    RestaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    ManagerContact: {
      type: Number,
      required: true,
      trim: true,
    },
    RestaurantAddress: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantAddedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesPerson",
    },
    categories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Restaurant = mongoose.model("Restaurant", addRestaurantsSchema);
