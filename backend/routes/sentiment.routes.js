import { getSentimentScore } from "../controllers/sentiment.controller.js";
import express from "express";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/sentiment-score/:id", protectRoute, getSentimentScore);

export default router;
