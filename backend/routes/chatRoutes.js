import express from "express";
import { converseWithAI, clearChatContext } from "../controllers/chatController.js";

const router = express.Router();

router.post("/ask", converseWithAI);
router.post("/clear", clearChatContext);

export default router;