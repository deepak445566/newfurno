import Chat from "../../models/chatModels.js";
import Message from "../../models/messageModels.js";

import mongoose from "mongoose";

export const createChat = async (req, res) => {
  try {
    const { receiverId, listingId, requestId } = req.body;


    if (req.user.id.toString() === receiverId) {
      return res.status(400).json({
        message: "You cannot chat with yourself"
      });
    }

    // 🔥 convert to ObjectId
    const senderObjectId = new mongoose.Types.ObjectId(req.user.id);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    let chat = await Chat.findOne({
      participants: { $all: [senderObjectId, receiverObjectId] },
      listingId,
      requestId,
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderObjectId, receiverObjectId],
        listingId,
        requestId,
      });
    }

    res.json(chat);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const getUserChats = async (req, res) => {
  try {

    const chats = await Chat.find({
      participants:req.user.id
    }).populate("participants","name avatar").populate("listingId","title images").sort({ createdAt: 1 });

    res.json(chats)
    
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

export const getMessage = async(req,res)=>{
  try {
    const message = await Message.find({
      chatId:req.params.chatId
    }).sort({createdAt:1})
    res.json(message)

  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

export const sendMessage = async(req,res)=>{
  try {
    const {chatId,text}=req.body;
    const message = await Message.create({
      chatId,
      senderId:req.user.id,
      text
    })


    await Chat.findByIdAndUpdate(chatId,{
      lastMessage:text,
      lastMessageAt:new Date()
    });

      const io = req.app.get("io");
       if (io) {
      io.to(chatId.toString()).emit("receiveMessage", message);
    }
  res.status(201).json(message);
    
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}