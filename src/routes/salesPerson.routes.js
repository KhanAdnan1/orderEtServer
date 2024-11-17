import { Router } from "express";

import {
  registerSalesPerson,
  loginSalesPerson,
} from "../controllers/salesPerson.controllers.js";

const router = Router();

router.route("/register").post(registerSalesPerson);
router.route("/login").post(loginSalesPerson);

export default router;
