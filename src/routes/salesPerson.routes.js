import { Router } from "express";

import {
  registerSalesPerson,
  loginSalesPerson,
  salesPesonLogout,
  getAllSalesperson,
} from "../controllers/salesPerson.controllers.js";
import { verifyJWT } from "../middlewares/salesPersonAuth.middleware.js";

const router = Router();

//router.route("/register").post(registerSalesPerson);
//router.route("/login").post(loginSalesPerson);

router.post("/login", loginSalesPerson);

router.post("/register", registerSalesPerson);

router.post("/logout", verifyJWT, salesPesonLogout);

router.get("/fetch", getAllSalesperson);

export default router;
