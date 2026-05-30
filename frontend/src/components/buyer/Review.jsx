import React, { useEffect, useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

const ReviewsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      comment: "Bahut badiya platform hai! Furniture sahi mila.",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Priya Patel",
      rating: 4,
      comment: "Accha experience raha. Seller ne time pe deliver kiya.",
      date: "2024-01-10",
    },
    {
      id: 3,
      name: "Amit Kumar",
      rating: 5,
      comment:
        "Best hai yaar. Mera purana sofa bech diya aur naya le liya.",
      date: "2024-01-05",
    },
    {
      id: 4,
      name: "Neha Singh",
      rating: 4,
      comment:
        "Sab kuch accha hai bas thoda aur response time chahiye.",
      date: "2024-01-18",
    },
    {
      id: 5,
      name: "Vikram Verma",
      rating: 5,
      comment: "Mast app hai. Sab kuch smooth hai.",
      date: "2024-01-20",
    },
    {
      id: 6,
      name: "Anjali Gupta",
      rating: 5,
      comment:
        "Amazing experience. Quality products and fast support.",
      date: "2024-01-25",
    },
  ];

  // Auto Slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev + 3 >= reviews.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? reviews.length - 3 : prev - 1
    );
  };

  const visibleReviews = reviews.slice(
    currentSlide,
    currentSlide + 3
  );

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] py-20 overflow-hidden">

      {/* Blur Background */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-200/30 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-200/30 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">

          <p className="uppercase tracking-[4px] text-sm text-gray-400 font-semibold">
            Testimonials
          </p>

          <h1 className="text-5xl font-black text-gray-900 mt-4">
            What Our Users Say
          </h1>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto text-lg">
            Trusted by hundreds of users buying and selling furniture.
          </p>
        </div>

        {/* Slider */}
        <div className="relative">

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">

            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="group bg-white/80 backdrop-blur-2xl border border-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500"
              >

                {/* Quote */}
                <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                  <Quote className="h-6 w-6" />
                </div>

                {/* Stars */}
                <StarRating rating={review.rating} />

                {/* Comment */}
                <p className="text-gray-600 leading-relaxed mt-6 text-lg min-h-[120px]">
                  "{review.comment}"
                </p>

                {/* User */}
                <div className="mt-8 flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                      {review.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {review.name}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Button */}
          <button
            onClick={prevSlide}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition hidden lg:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Button */}
          <button
            onClick={nextSlide}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition hidden lg:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">

          {reviews.slice(0, reviews.length - 2).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 ${
                currentSlide === idx
                  ? "w-10 h-3 rounded-full bg-black"
                  : "w-3 h-3 rounded-full bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;