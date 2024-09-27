import { Router } from "express";

import { registerSalesPerson } from "../controllers/salesPerson.controllers.js";

const router = Router()

router.route("/register").post(registerSalesPerson)

export default router;