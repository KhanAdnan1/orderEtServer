import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//app.use(cors());
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from all origins but only if credentials are present
    callback(null, true);
  },
  credentials: true, // Allow credentials (cookies, etc.)
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import salesPersonRouter from "./routes/salesPerson.routes.js";
import restaurantRoutes from "./routes/addRestaurant.routes.js";
import dishRoutes from "./routes/addDish.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import addCategoryRoutes from "./routes/addCategory.routes.js";

//routes declaration
app.use("/categories", addCategoryRoutes);
app.use("/sales", salesPersonRouter);
app.use("/restaurants", restaurantRoutes);
app.use("/dishes", dishRoutes);
app.use("/admin", adminRoutes);
export default app;
