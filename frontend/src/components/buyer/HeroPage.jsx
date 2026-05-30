import { useNavigate } from "react-router-dom";

const HeroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="flex-1 w-full lg:max-w-xl order-1 lg:order-2">
            <div className="space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-2">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Welcome to FurnoHub
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center lg:text-left">
                <span className="text-gray-900">Find Your Perfect</span>
                <br />
                <span className="text-green-600">Furniture Piece</span>
                <br />
                <span className="text-gray-900">Today!</span>
              </h1>

              {/* Stats - Responsive grid for mobile */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 py-2 sm:py-4">
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">10K+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Happy Customers</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">5K+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Products Sold</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">500+</p>
                  <p className="text-xs sm:text-sm text-gray-500">Trusted Sellers</p>
                </div>
              </div>

              {/* CTA Buttons - Stack on mobile, row on tablet+ */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  onClick={() => navigate("/products")}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-md hover:shadow-xl text-sm sm:text-base"
                >
                  Shop Now
                </button>
                <button
                  onClick={() => navigate("/nearby")}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  Check Nearby Listing
                </button>
              </div>
            </div>
          </div>

          {/* Right Image - Full width on mobile, adjusted on larger screens */}
          <div className="flex-1 w-full relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Main Image */}
              <img 
                src="./images/main.png"
                alt="Modern Living Room Furniture"
                className="w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] object-cover rounded-2xl"
              />
            </div>

            {/* Decorative Elements - Adjusted for mobile */}
            <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-green-200 rounded-full opacity-50 blur-2xl -z-10"></div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-bottom-8 lg:-right-8 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-green-300 rounded-full opacity-50 blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;