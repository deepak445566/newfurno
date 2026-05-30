import express from "express";
import {
  loginUser,
  logout,
  me,
  registerUser,
} from "../controllers/Auth/registerControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);

AuthRouter.get("/me", protect(), me);
AuthRouter.post("/logout", logout);

export default AuthRouter;
