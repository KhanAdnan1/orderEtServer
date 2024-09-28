import express from 'express';
import registerRestaurant from '../controllers/addRestaurant.controllers';
const router = express.Router();

router.post('/register', registerRestaurant);

export default router;