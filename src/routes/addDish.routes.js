import express from "express";
import {registerDish} from "../controllers/addDish.controller";

const router = express.Router();

// POST request to add a new dish
router.post("/add", registerDish);

export default router;