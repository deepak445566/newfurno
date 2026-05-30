// src/components/Listings/NearbyListings.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader, Tag, AlertCircle, Crosshair, Eye } from 'lucide-react';
import api from "../../utils/axios";
import { useNavigate } from 'react-router-dom';

const NearbyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const conditions = {
    'new': { label: 'New', color: 'bg-green-100 text-green-800' },
    'good': { label: 'Good', color: 'bg-blue-100 text-blue-800' },
    'used': { label: 'Used', color: 'bg-yellow-100 text-yellow-800' }
  };

  // Get user location
  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchNearbyListings(latitude, longitude);
      },
      (error) => {
        console.error(error);
        let errorMsg = "Unable to get location";
        if (error.code === 1) errorMsg = "Please allow location permission";
        if (error.code === 2) errorMsg = "Location unavailable";
        if (error.code === 3) errorMsg = "Location request timeout";
        setError(errorMsg);
        setGettingLocation(false);
      }
    );
  };

  // Fetch nearby listings
  const fetchNearbyListings = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/listing/items/nearby?lat=${lat}&lng=${lng}`);
      
      let listingsData = [];
      if (response.data.listings) {
        listingsData = response.data.listings;
      } else if (response.data.data?.listings) {
        listingsData = response.data.data.listings;
      } else if (Array.isArray(response.data)) {
        listingsData = response.data;
      }
      
      setListings(listingsData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch nearby listings");
    } finally {
      setLoading(false);
      setGettingLocation(false);
    }
  };

  const formatPrice = (listing) => {
    if (listing.type === 'free') return 'FREE';
    if (listing.type === 'donate') return 'Donation';
    return `₹${listing.price?.toLocaleString() || 0}`;
  };

  const getTypeBadge = (type) => {
    const styles = {
      'sell': 'bg-red-100 text-red-800',
      'donate': 'bg-purple-100 text-purple-800',
      'free': 'bg-emerald-100 text-emerald-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

 return (
  <div className="min-h-screen bg-[#f7f8fc] relative overflow-hidden">

    {/* Background Blur */}
    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-200/30 blur-3xl rounded-full"></div>

    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-200/30 blur-3xl rounded-full"></div>

    <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">

      {/* Header */}
      <div className="text-center mb-14">

        <p className="uppercase tracking-[4px] text-sm text-gray-400 font-semibold">
          Nearby Marketplace
        </p>

        <h1 className="text-5xl font-black text-gray-900 mt-4">
          Nearby Listings
        </h1>

        <p className="text-gray-500 mt-5 max-w-2xl mx-auto text-lg">
          Discover amazing products available around your location.
        </p>
      </div>

      {/* Location Button */}
      {!location && !loading && (
        <div className="flex justify-center mb-12">

          <button
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-black text-white font-semibold flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >

            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative z-10 flex items-center gap-3">

              {gettingLocation ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Crosshair className="h-5 w-5" />
                  Use My Current Location
                </>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Active Location */}
      {location && (
        <div className="mb-10">

          <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-2xl border border-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">

            <p className="flex items-center justify-center gap-3 text-green-700 font-medium">

              <Navigation className="h-5 w-5" />

              Showing listings near your location
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 mb-10">

          <div className="flex items-center gap-3 text-red-700">

            <AlertCircle className="h-5 w-5" />

            <p>{error}</p>
          </div>

          <button
            onClick={getCurrentLocation}
            className="mt-4 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24">

          <div className="w-20 h-20 rounded-full border-[6px] border-gray-200 border-t-black animate-spin"></div>

          <p className="text-gray-500 mt-6 text-lg">
            Finding nearby listings...
          </p>
        </div>
      )}

      {/* Listings */}
      {!loading && listings.length > 0 && (
        <>
          {/* Result Count */}
          <div className="flex items-center justify-between mb-10">

            <div>
              <p className="text-gray-500 text-lg">
                Found{" "}
                <span className="font-black text-black text-2xl">
                  {listings.length}
                </span>{" "}
                nearby listings
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {listings.map((listing) => (
              <div
                key={listing._id}
                className="group relative overflow-hidden rounded-[34px] bg-white border border-gray-200 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
              >

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-blue-100/20 opacity-0 group-hover:opacity-100 transition duration-500 z-0"></div>

                {/* Image */}
                <div className="relative h-[300px] overflow-hidden rounded-[28px] m-3">

                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Tag className="h-14 w-14 text-gray-400" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4">

                    <span
                      className={`px-4 py-2 rounded-full text-[11px] font-semibold tracking-[2px] uppercase backdrop-blur-xl border border-white/20 ${getTypeBadge(
                        listing.type
                      )}`}
                    >
                      {listing.type}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-5 left-5">

                    <p className="text-white/70 text-xs uppercase tracking-[3px]">
                      Price
                    </p>

                    <h1 className="text-3xl font-black text-white mt-1">
                      {formatPrice(listing)}
                    </h1>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 relative z-10">

                  {/* Category */}
                  <div className="flex items-center justify-between mb-4">

                    <div className="flex items-center gap-2">

                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                      <span className="text-xs uppercase tracking-[2px] text-gray-500 font-semibold">
                        {listing.category?.replace("_", " ")}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        conditions[listing.condition]?.color ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {conditions[listing.condition]?.label ||
                        listing.condition}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight line-clamp-1">
                    {listing.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between">

                    {/* Location */}
                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">

                        <MapPin className="h-5 w-5 text-gray-600" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-xs text-gray-400">
                          Location
                        </p>

                        <p className="text-sm font-medium text-gray-700 truncate">
                          {listing.address}
                        </p>
                      </div>
                    </div>

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
              </div>
            ))}
          </div>
        </>
      )}

      {/* No Listings */}
      {!loading && !error && location && listings.length === 0 && (
        <div className="max-w-2xl mx-auto text-center bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-14 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">

            <MapPin className="h-10 w-10 text-gray-400" />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            No Nearby Listings
          </h3>

          <p className="text-gray-500 text-lg">
            Try again later or explore another location.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!location && !loading && !error && (
        <div className="max-w-2xl mx-auto text-center bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-14 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">

            <Navigation className="h-10 w-10 text-gray-400" />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Enable Your Location
          </h3>

          <p className="text-gray-500 text-lg">
            Click the button above to discover nearby products.
          </p>
        </div>
      )}
    </div>
  </div>
);
};

export default NearbyListings;