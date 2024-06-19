import { Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { generateChatCompletion } from "../controllers/chat-controllers";

const chatRoutes = Router();

chatRoutes.post('/new', requireAuth, generateChatCompletion);

export default chatRoutes;
