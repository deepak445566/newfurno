import Review from "../../models/reviewModels.js";
import User from "../../models/userModels.js";


export const giveRating = async (req, res) => {
  try {
    const { reviewedUserId, rating } = req.body;
    const reviewerId = req.user.id;

    if (reviewerId.toString() === reviewedUserId.toString()) {
      return res.status(400).json({ message: "Cannot rate yourself" });
    }

   
    const review = await Review.create({
      reviewerId,
      reviewedUserId,
      rating
    });

  
    const allReviews = await Review.find({ reviewedUserId });
    
  
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const average = total / allReviews.length;

    await User.findByIdAndUpdate(reviewedUserId, {
      'rating.average': average,
      'rating.count': allReviews.length
    });

    res.json({ message: "Rating given", rating: average });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserRating = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('name rating');
    
    res.json({
      name: user.name,
      averageRating: user.rating.average,
      totalRatings: user.rating.count
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};