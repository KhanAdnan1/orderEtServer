import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//import routes
import salesPersonRegisterRouter from "./routes/salesPerson.routes.js";
import restaurantRoutes from "./routes/addRestaurant.routes.js";
import dishRoutes from "./routes/addDish.routes.js";

//routes declaration
app.use("/sales", salesPersonRegisterRouter);
app.use("/restaurants", restaurantRoutes);
app.use("/dishes", dishRoutes);
export default app;
