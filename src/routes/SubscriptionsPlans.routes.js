import express from "express";

import {
  addPlans,
  getSubscriptionsPlans,
  updatePlan,
  removePlan,
} from "../controllers/SubscriptionsPlans.controllers.js";

const router = express.Router();
router.post("/plans", addPlans);
router.get("/all", getSubscriptionsPlans);
router.put("/update/:id", updatePlan);
router.delete("/remove/:id", removePlan);

export default router;
