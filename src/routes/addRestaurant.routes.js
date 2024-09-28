import express from 'express';
<<<<<<< HEAD
import { registerRestaurant } from '../controllers/addRestaurant.controllers.js'; // Adjust path if necessary

=======
import registerRestaurant from '../controllers/addRestaurant.controllers';
>>>>>>> 671346b85a9314cbc4674ac24d917d0fdef1ead5
const router = express.Router();

router.post('/register', registerRestaurant);

export default router;