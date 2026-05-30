import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { acceptRequest, createRequest, getBuyerRequest, getSellerRequest, rejectRequest } from "../controllers/Request/requestControllers.js";


const RequestRouter = express.Router();

RequestRouter.post("/",protect("buyer"),createRequest);
RequestRouter.get("/buyer",protect("buyer"),getBuyerRequest)
RequestRouter.get("/seller",protect("seller"),getSellerRequest)
RequestRouter.patch("/:id/accept",protect("seller"),acceptRequest)
RequestRouter.patch("/:id/reject",protect("seller"),rejectRequest)
export default RequestRouter;
