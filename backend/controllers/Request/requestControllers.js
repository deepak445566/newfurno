import Listing from "../../models/listingModels.js";
import Request from "../../models/requestModels.js";



export const createRequest = async(req,res)=>{
  try {
   const {listingId,offeredPrice}=req.body;
   const listing = await Listing.findById(listingId);

   if(!listing){
    return res.json(404).json({message:"Listing not found"})
   }

   const request = await Request.create({
    listingId,
     buyerId: req.user.id,
      sellerId: listing.userId,
      offeredPrice
   })
  res.status(201).json(request);
  } catch (error) {
     if (error.code === 11000) {
      return res.status(400).json({
        message: "You already sent request for this listing"
      });
    }
    res.status(500).json({ message: error.message });
  
  }
}

export const getBuyerRequest = async(req,res)=>{
  try {
    const request = await Request.find({buyerId:req.user.id}).populate("listingId").populate("sellerId", "name phone");

    res.json(request);
  } catch (error) {
       res.status(500).json({ message: error.message });
  
  }
}
export const getSellerRequest = async(req,res)=>{
  try {
    const request = await Request.find({sellerId:req.user.id}).populate("listingId").populate("buyerId", "name phone");

    res.json(request);
  } catch (error) {
       res.status(500).json({ message: error.message });
  
  }
}


export const acceptRequest = async(req,res)=>{
  try {
    const request = await Request.findById(req.params.id);
    if(!request){
      return res.status(404).json({message:"Request Not Found"})
    }
     if (request.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    request.status="accepted"
     await request.save();

     await Listing.findByIdAndUpdate(request.listingId,{
      status:"matched"
     })
      res.json(request);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    request.status = "rejected";
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}