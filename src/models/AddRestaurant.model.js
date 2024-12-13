// import mongoose from "mongoose";

// const addRestaurantsSchema = new mongoose.Schema(
//   {
//     // Fields for the restaurant
//     RestaurantManagerName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     RestaurantName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     ManagerContact: {
//       type: Number,
//       required: true,
//       trim: true,
//     },
//     RestaurantAddress: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     restaurantAddedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SalesPerson",
//     },
//     categories: {
//       type: [String],
//       default: [],
//     },
//     subscription: {
//       type: {
//         plan: {
//           type: String, // e.g., "1 month", "6 months", "1 year"
//           required: true,
//         },
//         startDate: {
//           type: Date,
//           default: Date.now, // Defaults to the current date
//         },
//         endDate: {
//           type: Date, // To be calculated based on the plan
//           required: true,
//         },
//         active: {
//           type: Boolean,
//           default: true, // Automatically active upon addition
//         },
//       },
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// export const Restaurant = mongoose.model("Restaurant", addRestaurantsSchema);


import mongoose from "mongoose";

const addRestaurantsSchema = new mongoose.Schema(
  {
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
    subscription: {
      type: {
        planId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Plans", // Reference to the Subscriptions model
          required: true,
        },
        startDate: {
          type: Date,
          default: Date.now,
        },
        endDate: {
          type: Date,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        active: {
          type: Boolean,
          default: true,
        },
      },
      required: true,
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
