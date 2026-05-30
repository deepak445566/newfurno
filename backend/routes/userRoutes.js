import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  getUserById,
  updateProfile,
} from "../controllers/User/UserControllers.js";

const UserRouter = express.Router();

UserRouter.get("/profile", protect(), getProfile);

UserRouter.put("/update", protect(), updateProfile);

UserRouter.get("/:id", protect(), getUserById);

export default UserRouter;
