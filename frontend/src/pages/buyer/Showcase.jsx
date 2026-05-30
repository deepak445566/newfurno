import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const ShowCase = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/listing/alllisting");
      setListings(response.data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const getTypeGradient = (type) => {
    const gradients = {
      sell: "from-amber-500 to-orange-500",
      donate: "from-emerald-500 to-green-500",
      free: "from-sky-500 to-blue-500",
    };
    return gradients[type] || "from-gray-500 to-gray-600";
  };

  const getTypeIcon = (type) => {
    const icons = { sell: "💰", donate: "🎁", free: "🎉" };
    return icons[type] || "📦";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchListings} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-10 mer">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 ">
          <h1 className="text-3xl  text-gray-900">Recent Listings</h1>
        
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-4">Start selling your furniture today!</p>
            <button
              onClick={() => navigate("/sell")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
            >
              Create First Listing
            </button>
          </div>
        ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {listings.slice(0, 4).map((listing) => (
    <div
      key={listing._id}
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="group relative overflow-hidden rounded-[34px] bg-white border border-gray-200 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
    >

      {/* Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-blue-100/20 opacity-0 group-hover:opacity-100 transition duration-500 z-0"></div>

      {/* Image Section */}
      <div className="relative h-[320px] overflow-hidden rounded-[28px] m-3">

        {listing.images?.[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover "
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            No Image
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* Top Row */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">

          {/* Type Badge */}
          <div className="px-4 py-2 rounded-full bg-white backdrop-blur-xl border border-white/20 text-black text-xs font-semibold tracking-[2px] uppercase">
            {listing.type}
          </div>

         
        </div>

        {/* Price */}
        <div className="absolute bottom-5 left-5">

          <p className="text-white/70 text-xs uppercase tracking-[3px]">
            Price
          </p>

          <h1 className="text-3xl font-bold text-white mt-1">
            {listing.type === "free"
              ? "FREE"
              : `₹${listing.price?.toLocaleString()}`}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-2 relative z-10 flex justify-between ">

      

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-black transition">
          {listing.title}
        </h2>

      

   
         
       

       <button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/listing/${listing._id}`);
  }}
  className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 17L17 7M17 7H8M17 7V16"
    />
  </svg>
</button>
        </div>
      </div>
   
  ))}
</div>
        )}
      </div>
    </div>
  );
};

export default ShowCase;