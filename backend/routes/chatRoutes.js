import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createChat, getMessage, getUserChats, sendMessage } from "../controllers/Chat/chatControllers.js";



const chatRouter = express.Router();

chatRouter.post("/", protect(), createChat);

chatRouter.get("/", protect(), getUserChats);


chatRouter.get("/:chatId/messages", protect(), getMessage);

chatRouter.post("/send", protect(), sendMessage);

export default chatRouter;
