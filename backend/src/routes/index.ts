import { Router } from "express";
import userRoutes from "./user-routes";
import chatRoutes from "./chat-routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/chats", chatRoutes)

export default Router;