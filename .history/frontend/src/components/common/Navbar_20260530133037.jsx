import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const isSeller = user?.role === "seller" || user?.userType === "seller";
  const isBuyer = user?.role === "buyer" || user?.userType === "buyer" || (!isSeller && user?.role === "user");

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              onClick={() => handleNavigation("/")} 
              className="text-xl sm:text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors"
            >
              FurnoHub
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Home - Common */}
            <button
              onClick={() => handleNavigation("/")}
              className={`px-3 py-2 rounded-lg transition ${
                isActive("/") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Home
            </button>

            {/* SELLER SECTION */}
            {isSeller && (
              <>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-xs text-gray-500 font-semibold">SELLER</span>
                
                <button
                  onClick={() => handleNavigation("/create")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/create") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  + Add Listing
                </button>
                
                <button
                  onClick={() => handleNavigation("/seller/listings")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/seller/listings") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  My Listings
                </button>
                
                <button
                  onClick={() => handleNavigation("/seller/requests")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/seller/requests") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Requests 📋
                </button>
                 <button
                  onClick={() => handleNavigation("/messages")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/messages") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Messages
                </button>
               
              </>
            )}

            {/* BUYER SECTION */}
            {isBuyer && (
              <>
                <div className="h-6 w-px bg-gray-300"></div>
              
                
                <button
                  onClick={() => handleNavigation("/allListing")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/allListing") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Browse Items
                </button>
                
                <button
                  onClick={() => handleNavigation("/requests/buyer")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/requests/buyer") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  My Requests
                </button>
                
                <button
                  onClick={() => handleNavigation("/messages")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/messages") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Messages
                </button>
                
                <button
                  onClick={() => handleNavigation("/purchases")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/purchases") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Purchases
                </button>
              </>
            )}
          </div>

          {/* User Menu & Mobile Button */}
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <button
              onClick={handleProfile}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-semibold shadow-md hover:scale-105 transition"
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              
              {/* Home */}
              <button
                onClick={() => handleNavigation("/")}
                className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left"
              >
                🏠 Home
              </button>

              {/* SELLER Mobile Section */}
              {isSeller && (
                <>
                  <div className="pt-2 pb-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Seller</p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/create")}
                    className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left pl-8"
                  >
                    ➕ Add Listing
                  </button>
                  <button
                    onClick={() => handleNavigation("/seller/listings")}
                    className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left pl-8"
                  >
                    📋 My Listings
                  </button>
                  <button
                    onClick={() => handleNavigation("/seller/requests")}
                    className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left pl-8"
                  >
                    📌 Requests
                  </button>
                   <button
                  onClick={() => handleNavigation("/messages")}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive("/messages") ? "bg-green-100 text-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Messages
                </button>
                 
                </>
              )}

              {/* BUYER Mobile Section */}
              {isBuyer && (
                <>
                  <div className="pt-2 pb-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Buyer</p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/allListing")}
                    className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left pl-8"
                  >
                    🛍️ Browse Items
                  </button>
                  <button
                    onClick={() => handleNavigation("/requests/buyer")}
                    className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left pl-8"
                  >
                    📝 My Requests
                  </button>
                  <button
                    onClick={() => handleNavigation("/messages")}
                    className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left pl-8"
                  >
                    💬 Messages
                  </button>
                  <button
                    onClick={() => handleNavigation("/purchases")}
                    className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left pl-8"
                  >
                    🎁 Purchases
                  </button>
                </>
              )}

              <div className="pt-4 border-t border-gray-200 mt-2">
                <button
                  onClick={handleProfile}
                  className="w-full px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg text-left"
                >
                  👤 My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;