import express from 'express';

import { adminLogin, adminLogout, adminRegister } from '../controllers/admin.controllers.js';
import { verifyJWT } from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

router.post('/register', adminRegister);

router.post('/login', adminLogin)

router.post('/logout', verifyJWT, adminLogout)

export default router;

