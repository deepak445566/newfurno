import express from "express"
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import AuthRouter from "./routes/authRoutes.js";
import UserRouter from "./routes/userRoutes.js";
import ListingRouter from "./routes/listingRoutes.js";
import RequestRouter from "./routes/requestRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import connectCloudinary from "./config/cloudinary.js";


dotenv.config();

const app = express();
const server = http.createServer(app);
await connectDB();
await connectCloudinary();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
app.set("io", io);

// In your main server file (where io is initialized)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user to their personal room for direct messages
  socket.on("register", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
app.use(express.json());
app.use(cookieParser());



app.use("/api/auth",AuthRouter);
app.use("/api/user",UserRouter)
app.use("/api/listing",ListingRouter);
app.use("/api/request",RequestRouter)
app.use("/api/chat", chatRouter);
app.use("/api/review",reviewRouter)


app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:");
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
    error: err
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy ok ha', timestamp: new Date() });
});


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});