import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createListing,
  deleteListing,
  getAllListings,
  getCategories,
  getSingleListing,
  getUserListings,
  searchNearByListings,
  updateListing,
} from "../controllers/Listing/listingControllers.js";
import { uploadMultiple } from "../config/cloudinary.js";

const ListingRouter = express.Router();

ListingRouter.post("/create", protect("seller"),uploadMultiple, createListing);
ListingRouter.get("/alllisting", protect(), getAllListings);
ListingRouter.get("/user/mylisting", protect("seller"), getUserListings);
ListingRouter.get("/:id", protect(), getSingleListing);

ListingRouter.put("/update/:id",uploadMultiple, protect("seller"), updateListing);
ListingRouter.delete("/delete/:id", protect("seller"), deleteListing);
ListingRouter.get("/items/nearby", protect("buyer"), searchNearByListings);

ListingRouter.get("/items/category", getCategories);
export default ListingRouter;
