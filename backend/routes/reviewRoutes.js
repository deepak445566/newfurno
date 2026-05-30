import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserRating, giveRating } from '../controllers/Reviews/reviewControllers.js';



const reviewRouter = express.Router();

reviewRouter.post('/rating', protect('buyer'), giveRating);           
reviewRouter.get('/rating/:userId', getUserRating);         

export default reviewRouter;