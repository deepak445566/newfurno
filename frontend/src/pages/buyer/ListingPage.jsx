// src/components/Listings/ListingsPage.jsx
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Filter,
  Search,
  X,
  Heart,
  Tag,
  AlertCircle,
} from "lucide-react";

import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const ListingsPage = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredListings, setFilteredListings] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedType, setSelectedType] = useState("all");

  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState([]);

  const listingTypes = [
    { value: "all", label: "All Types" },
    { value: "sell", label: "For Sale" },
    { value: "donate", label: "Donate" },
    { value: "free", label: "Free" },
  ];

  const conditions = {
    new: {
      label: "New",
      color: "bg-green-100 text-green-800",
    },

    good: {
      label: "Good",
      color: "bg-blue-100 text-blue-800",
    },

    used: {
      label: "Used",
      color: "bg-yellow-100 text-yellow-800",
    },
  };

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [
    listings,
    searchTerm,
    selectedCategory,
    selectedType,
    priceRange,
  ]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/listing/items/category");

      const cats = response.data.categories || response.data;

      setCategories([
        {
          value: "all",
          label: "All Categories",
        },

        ...cats.map((c) => ({
          value: c,
          label: c.toUpperCase().replace("_", " "),
        })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/listing/alllisting");

      setListings(data);
      setFilteredListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          listing.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (listing) => listing.category === selectedCategory
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(
        (listing) => listing.type === selectedType
      );
    }

    if (priceRange.min) {
      filtered = filtered.filter(
        (listing) => listing.price >= Number(priceRange.min)
      );
    }

    if (priceRange.max) {
      filtered = filtered.filter(
        (listing) => listing.price <= Number(priceRange.max)
      );
    }

    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedType("all");

    setPriceRange({
      min: "",
      max: "",
    });
  };

  const getTypeBadge = (type) => {
    const styles = {
      sell: "bg-red-100 text-red-800",
      donate: "bg-purple-100 text-purple-800",
      free: "bg-emerald-100 text-emerald-800",
    };

    return styles[type] || "bg-gray-100 text-gray-800";
  };

  const formatPrice = (listing) => {
    if (listing.type === "free") return "FREE";

    if (listing.type === "donate") return "Donation";

    return `₹${listing.price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading listings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />

          <p>Error: {error}</p>

          <button
            onClick={fetchListings}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-white/20">

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-5">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

            {/* LEFT */}
            <div>
              <p className="text-xs uppercase tracking-[4px] text-gray-400 font-semibold">
                Marketplace
              </p>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mt-2">
                Browse Listings
              </h1>

              <p className="text-gray-500 mt-2 text-sm lg:text-base">
                Discover amazing products around you
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">

              {/* SEARCH */}
              <div className="relative flex-1 min-w-full sm:min-w-[300px]">

                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full h-14 pl-14 pr-14 rounded-2xl bg-white border border-gray-200 shadow-sm outline-none text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-black/5 transition-all"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-black transition" />
                  </button>
                )}
              </div>

              {/* FILTER BUTTON */}
              <button
                onClick={() =>
                  setShowFilters(!showFilters)
                }
                className="h-14 px-6 rounded-2xl bg-black text-white flex items-center justify-center gap-3 hover:scale-[1.03] transition-all duration-300 shadow-xl"
              >
                <Filter className="h-5 w-5" />

                Filters

                {(selectedCategory !== "all" ||
                  selectedType !== "all" ||
                  priceRange.min ||
                  priceRange.max) && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="mt-6 p-6 rounded-[30px] bg-white border shadow-sm">

              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">

                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </label>

                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value)
                    }
                    className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white outline-none"
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat.value}
                        value={cat.value}
                      >
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TYPE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Listing Type
                  </label>

                  <select
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(e.target.value)
                    }
                    className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white outline-none"
                  >
                    {listingTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRICE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range
                  </label>

                  <div className="flex gap-3">

                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none"
                    />

                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: e.target.value,
                        })
                      }
                      className="w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">
                  Showing premium marketplace results
                </p>

                <button
                  onClick={clearFilters}
                  className="px-6 h-12 rounded-2xl bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESULT */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-600">
          Found{" "}
          <span className="font-semibold">
            {filteredListings.length}
          </span>{" "}
          listings
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto px-4 pb-12">

        {filteredListings.length === 0 ? (

          <div className="text-center py-12">

            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No listings found
            </h3>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Clear Filters
            </button>
          </div>

        ) : (

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">

            {filteredListings.map((listing) => (

              <div
  key={listing._id}
  className="w-full min-w-0 group relative overflow-hidden rounded-[20px] sm:rounded-[34px] bg-white border border-gray-200 cursor-pointer transition-all duration-500"
>

                {/* IMAGE */}
               <div className="relative h-[170px] sm:h-[240px] lg:h-[300px] overflow-hidden rounded-[20px] sm:rounded-[28px] m-2 sm:m-3">

                  {listing.images?.[0] ? (

                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Tag className="h-14 w-14 text-gray-400" />
                    </div>
                  )}

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                  {/* BADGE */}
                  <div className="absolute top-4 left-4">

                    <span
                      className={`px-4 py-2 rounded-full text-[11px] font-semibold tracking-[2px] uppercase backdrop-blur-xl border border-white/20 ${getTypeBadge(
                        listing.type
                      )}`}
                    >
                      {listing.type}
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="absolute bottom-5 left-5">

                    <p className="text-white/70 text-xs uppercase tracking-[3px]">
                      Price
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                      {formatPrice(listing)}
                    </h1>
                  </div>
                </div>

                {/* CONTENT */}
              <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-2">

                  {/* TOP */}
                  <div className="flex items-center justify-between mb-4 gap-3">

                    <div className="flex items-center gap-2 min-w-0">

                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                      <span className="text-xs uppercase tracking-[2px] text-gray-500 font-semibold truncate">
                        {listing.category.replace("_", " ")}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${conditions[listing.condition]?.color}`}
                    >
                      {
                        conditions[listing.condition]
                          ?.label
                      }
                    </span>
                  </div>

                  {/* TITLE */}
                <h2 className="text-[13px] sm:text-2xl font-bold text-gray-900 leading-tight line-clamp-1">
                    {listing.title}
                  </h2>

                  {/* FOOTER */}
                  <div className="mt-6 flex items-center justify-between gap-4">

                    {/* LOCATION */}
                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-gray-600" />
                      </div>

                    <div className="hidden sm:flex items-center gap-3 min-w-0">

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

                        navigate(
                          `/listing/${listing._id}`
                        );
                      }}
                      className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shrink-0"
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
        )}
      </div>
    </div>
  );
};

export default ListingsPage;