import { CATEGORIES } from "../../config/categories.js";
import { deleteMultipleFromCloudinary } from "../../config/cloudinary.js";
import Listing from "../../models/listingModels.js";



export const createListing = async (req,res)=> {
  
  try {
   const {title,description,category,condition,type,price,address,lat,lng} = req.body;

  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "At least one image is required" 
      });
    }

        const imageUrls = req.files.map(file => file.path);
   const listing = await Listing.create({
    userId:req.user.id,
    title,
    description,
    images: imageUrls,
    category,
    condition,
    type,
    price,
    address,
    location:{
      type:"Point",
       coordinates: [lng, lat]
    }
   })

    res.status(201).json(listing);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }

}

export const getAllListings = async(req,res)=>{
  try {
    const listing = await Listing.find({status:"active"}).populate("userId", "name phone rating");
    res.json(listing)
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}
export const getSingleListing = async(req,res)=>{
  try {
   const listing = await Listing.findById(req.params.id)
      .populate("userId", "name phone rating");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
}
export const getUserListings = async (req, res) => {
  try {
    
    const listings = await Listing.find({ userId: req.user.id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: "Listing Not Found" });
    }
    
    if (listing.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    
    // Remove images field - so it never updates
    delete req.body.images;
    
    const updated = await Listing.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    res.json(updated);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async(req,res)=>{
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
 return res.status(404).json({message:"Listing Not Found"})
    }
    if(listing.userId.toString()!==req.user.id.toString()){
      return res.status(403).json({message:"Not allowed"})
    }

    await listing.deleteOne();
      res.json({ message: "Listing deleted" });
  } catch (error) {
       res.status(500).json({ message: error.message });
  }
}


export const searchNearByListings = async (req, res) => {
  try {
    const { lng, lat } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({
        message: "Longitude and latitude are required"
      });
    }
    
  
    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);
    
    if (isNaN(longitude) || isNaN(latitude)) {
      return res.status(400).json({
        message: "Invalid coordinates"
      });
    }
    
    const listings = await Listing.find({
      location: {
        $near: {              //iska use for geopatial queies to find documt closed to given location and mongodb ma required kalna padta ha 2dsphere index on ocation filed to efficently calculate psherical distances
        // //
          $geometry: {            
            type: "Point",
            coordinates: [longitude, latitude] 
          },
          $maxDistance: 5000        
        }
      }
    });
    
    res.json({
      success: true,
      count: listings.length,
      listings
    });
    
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const getCategories = (req, res) => {
  try {
    res.json({
      success: true,
      count: CATEGORIES.length,
      categories: CATEGORIES
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};