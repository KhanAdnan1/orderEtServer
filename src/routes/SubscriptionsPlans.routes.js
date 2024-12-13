import express from "express"

import { addPlans, getSubscriptionsPlans } from "../controllers/SubscriptionsPlans.controllers.js"


const router= express.Router();
router.post("/plans",addPlans)
router.get("/all",getSubscriptionsPlans)

export default router;