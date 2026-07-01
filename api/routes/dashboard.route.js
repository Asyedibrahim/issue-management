import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", getDashboard);

export default router;