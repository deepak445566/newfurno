import mongoose from "mongoose";
import { CATEGORIES } from "../config/categories.js";

const listingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: CATEGORIES,
      required:true,
    },
    condition: {
      type: String,
      enum: ["new", "good", "used"],
      required: true,
    },
    type: {
      type: String,
      enum: ["sell", "donate", "free"],
      default: "sell",
    },
    price: {
      type: Number,
      required: true,
      min:0
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["active", "matched", "completed"],
       default: "active"
    },
  },
  { timestamps: true },
);

listingSchema.index({ location: "2dsphere" });
const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
export default Listing;
