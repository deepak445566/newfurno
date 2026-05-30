// src/components/Listings/ListingDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/api/listing/${id}`);

      setListing(response.data);
    } catch (error) {
      console.error(error);

      alert("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (type, price) => {
    if (type === "free") return "FREE";

    if (type === "donate") {
      return `Donation ₹${price}`;
    }

    return `₹${price?.toLocaleString()}`;
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case "new":
        return "✨ Brand New";

      case "good":
        return "👍 Good Condition";

      case "used":
        return "🔄 Used";

      default:
        return condition;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "sell":
        return "💰 For Sale";

      case "donate":
        return "🎁 Donation";

      case "free":
        return "🎉 Free";

      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">

        <div className="text-center">

          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-black mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading listing...
          </p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">

        <div className="text-center">

          <p className="text-gray-600">
            Listing not found
          </p>

          <button
            onClick={() => navigate("/listings")}
            className="mt-4 px-6 py-3 bg-black text-white rounded-2xl"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-4 sm:py-10 px-3 sm:px-4">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-5 sm:mb-8 gap-3">

          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 sm:gap-3 bg-white border border-gray-200 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl hover:shadow-lg transition-all duration-300"
          >

            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>

            <span className="font-medium text-sm sm:text-base">
              Back
            </span>
          </button>

          {/* BADGE */}
          <div className="hidden md:flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-sm tracking-[2px] uppercase">
            ✨ Premium Listing
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 sm:gap-8">

          {/* LEFT SIDE */}
          <div>

            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-[22px] sm:rounded-[36px] bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

              {listing.images && listing.images.length > 0 ? (

                <img
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  className="w-full h-[300px] sm:h-[500px] lg:h-[620px] object-cover sm:object-contain"
                />

              ) : (

                <div className="w-full h-[300px] sm:h-[500px] lg:h-[620px] bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* TOP */}
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex justify-between">

                <div className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/90 backdrop-blur-xl text-black text-[10px] sm:text-xs font-bold tracking-[2px] sm:tracking-[3px] uppercase">
                  {getTypeText(listing.type)}
                </div>

                <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition">
                  ❤️
                </button>
              </div>

              {/* PRICE */}
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8">

                <p className="text-white/70 uppercase tracking-[4px] text-[10px] sm:text-xs">
                  Price
                </p>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mt-2">
                  {formatPrice(listing.type, listing.price)}
                </h1>
              </div>
            </div>

            {/* THUMBNAILS */}
            {listing.images && listing.images.length > 1 && (

              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-5 overflow-x-auto pb-2">

                {listing.images.map((img, index) => (

                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 flex-shrink-0 ${
                      selectedImage === index
                        ? "border-black scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >

                    <img
                      src={img}
                      alt=""
                      className="w-16 h-16 sm:w-24 sm:h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4 sm:space-y-6">

            {/* TITLE CARD */}
            <div className="bg-white rounded-[22px] sm:rounded-[32px] border border-gray-200 p-4 sm:p-8 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                    {listing.title}
                  </h1>

                  <div className="flex items-center gap-3 mt-5 flex-wrap">

                    <div className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium">
                      {getConditionText(listing.condition)}
                    </div>

                    <div className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium">
                      📅{" "}
                      {new Date(
                        listing.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl sm:text-3xl shadow-xl shrink-0">
                  📦
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-[22px] sm:rounded-[32px] border border-gray-200 p-4 sm:p-8 shadow-sm">

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
                Description
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-[15px] whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* SELLER */}
            <div className="bg-white rounded-[22px] sm:rounded-[32px] border border-gray-200 p-4 sm:p-8 shadow-sm">

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                Seller Information
              </h2>

              <div className="flex items-center gap-4 sm:gap-5">

                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl">
                  {listing.userId?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {listing.userId?.name || "User"}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Trusted Seller
                  </p>
                </div>
              </div>

              {!showContact ? (

                <button
                  onClick={() => setShowContact(true)}
                  className="w-full mt-5 sm:mt-7 h-12 sm:h-14 rounded-2xl bg-black text-white font-semibold hover:scale-[1.01] transition-all duration-300"
                >
                  📞 Contact Seller
                </button>

              ) : (

                <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-200 p-4">

                  <div className="space-y-3">

                    <div className="text-sm sm:text-base text-gray-700">
                      📞 {listing.userId?.phone || "Not Provided"}
                    </div>

                    <div className="text-sm sm:text-base text-gray-700">
                      📧 {listing.userId?.email || "Not Provided"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LOCATION */}
            <div className="bg-white rounded-[22px] sm:rounded-[32px] border border-gray-200 p-4 sm:p-8 shadow-sm">

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
                Pickup Location
              </h2>

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                  📍
                </div>

                <div>

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {listing.address}
                  </p>

                  <button
                    className="mt-4 px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">

              <button className="h-12 sm:h-14 rounded-2xl bg-black text-white font-semibold hover:bg-gray-800 transition">
                💬 Message
              </button>

              <button className="h-12 sm:h-14 rounded-2xl border border-gray-300 bg-white font-semibold hover:bg-gray-100 transition">
                🖨️ Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;