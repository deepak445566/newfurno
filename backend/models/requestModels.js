import mongoose, { Types } from "mongoose";

const requestSchema = new mongoose.Schema(
  {
listingId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Listing",
  required:true
},
buyerId:{
   type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
},
sellerId:{
   type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
},
offeredPrice:{
  type:Number,
  required:true
},
 status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },

    
  },  { timestamps: true })

  requestSchema.index({ listingId: 1 });
requestSchema.index({ buyerId: 1 });//Large app me fast queries ke liye zaruri hai//
requestSchema.index({ sellerId: 1 });
requestSchema.index(
  { listingId: 1, buyerId: 1 },
  { unique: true }    //same buyer same listing pa multiple request na kar saka//
);

  const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);
  export default Request;