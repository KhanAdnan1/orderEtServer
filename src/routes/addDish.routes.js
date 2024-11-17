import express from "express";
import { registerDish } from "../controllers/addDish.controller.js";

const router = express.Router();

// POST request to add a new dish
router.post("/add", registerDish);

export default router;
