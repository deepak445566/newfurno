import User from "../../models/userModels.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await User.findById(userId).select("-password");

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: userProfile,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async(req,res)=>{
  try {
  const {phone,avatar,address,lat,lng}=req.body;


const updateData={};

   if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (address) updateData.address = address;
    if (lat && lng) {
      updateData.location = {
        type: "Point",
        coordinates: [lng, lat]
      };
    }
     const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

      res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getUserById = async(req,res)=>{
  try {
    const user= await User.findById(req.params.id).select("-password");
    if(!user){
       return res.status(404).json({ message: "User not found" });
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: err.message })
  }
}