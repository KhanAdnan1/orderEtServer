import express from 'express';
import { registerRestaurant } from '../controllers/RegisterRestaurant.controller.js'; // Adjust path if necessary

const router = express.Router();

router.post('/register', registerRestaurant);

export default router;