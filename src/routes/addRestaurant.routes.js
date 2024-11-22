import express from "express";

import { registerRestaurant } from "../controllers/addRestaurant.controllers.js"; // Adjust path if necessary
//import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",  registerRestaurant);

export default router;
