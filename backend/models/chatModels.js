import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing"
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request"
    },

    lastMessage: {
      type: String,
      default: ""
    },

    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;
