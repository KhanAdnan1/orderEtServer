import mongoose from "mongoose";

// AddDish schema
const addDishSchema = new mongoose.Schema(
  {
    // Fields for the dish
    dishName: {
      type: String,
      required: true,
      trim: true,
    },
    dishCategory: {
      type: String,
      required: true,
      trim: true,
    },
    dishPrice: {
      type: Number,
      default: 0,
      trim: true,
    },

    // Reference to the Restaurant model
    dishOfTheRestaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Dish = mongoose.model("Dish", addDishSchema);
