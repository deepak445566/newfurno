import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const BuyerRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchBuyerRequests();
  }, []);

  const fetchBuyerRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/request/buyer");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      alert("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: "⏳", text: "Pending", gradient: "from-amber-500 to-orange-500" },
      accepted: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "✅", text: "Accepted", gradient: "from-emerald-500 to-teal-500" },
      rejected: { color: "bg-rose-50 text-rose-700 border-rose-200", icon: "❌", text: "Rejected", gradient: "from-rose-500 to-red-500" },
      completed: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: "🎉", text: "Completed", gradient: "from-blue-500 to-indigo-500" }
    };
    return statuses[status] || { color: "bg-gray-50 text-gray-700 border-gray-200", icon: "📦", text: status, gradient: "from-gray-500 to-gray-600" };
  };

  const formatPrice = (type, price) => {
    if (type === "free") return "FREE";
    if (type === "donate") return `Donation: ₹${price}`;
    return `₹${price?.toLocaleString() || 0}`;
  };

  const getTypeInfo = (type) => {
    const types = {
      sell: { icon: "💰", text: "For Sale", color: "text-emerald-600" },
      donate: { icon: "🎁", text: "For Donation", color: "text-purple-600" },
      free: { icon: "🎉", text: "Free", color: "text-blue-600" }
    };
    return types[type] || { icon: "📦", text: type, color: "text-gray-600" };
  };

  const filteredRequests = activeFilter === "all" 
    ? requests 
    : requests.filter(r => r.status === activeFilter);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    completed: requests.filter(r => r.status === "completed").length
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCancelRequest = async (requestId) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await api.delete(`/api/request/${requestId}`);
        alert("Request cancelled successfully");
        fetchBuyerRequests();
      } catch (error) {
        console.error("Error cancelling request:", error);
        alert("Failed to cancel request");
      }
    }
  };

  const handleContactSeller = (seller) => {
    setSelectedSeller(seller);
    setShowContactModal(true);
  };

 
  const handleMessageSeller = async (sellerId, sellerName, listingId, requestId) => {
    try {
      const response = await api.post("/api/chat", {
        receiverId: sellerId,
        listingId: listingId,
        requestId: requestId
      }, {
        withCredentials: true
      });
      
      navigate("/messages", { 
        state: { 
          chatId: response.data._id,
          otherUser: sellerName,
          otherUserId: sellerId
        } 
      });
      setShowContactModal(false);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert(error.response?.data?.message || "Could not start conversation");
    }
  };

  const StatCard = ({ title, value, icon, gradient, trend }) => (
    <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
      </div>
    </div>
  );

  const FilterButton = ({ filter, label, count }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
        activeFilter === filter
          ? "bg-gray-900 text-white shadow-lg scale-105"
          : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          activeFilter === filter ? "bg-white/20" : "bg-gray-100"
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  const RequestCard = ({ request }) => {
    const statusBadge = getStatusBadge(request.status);
    const listing = request.listingId;
    const typeInfo = getTypeInfo(listing?.type);

    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${statusBadge.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} style={{ padding: '2px', margin: '-2px' }}></div>
          
          <div className="relative bg-white rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Section */}
              <div className="relative lg:w-36 h-36 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                {listing?.images?.[0] ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🪑</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {listing?.title || "Unknown Item"}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-sm font-medium ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.text}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl ${statusBadge.color} border font-medium flex items-center gap-2 shadow-sm`}>
                    <span>{statusBadge.icon}</span>
                    <span>{statusBadge.text}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Offered Price</p>
                    <p className="text-xl font-bold text-gray-900">{formatPrice(listing?.type, request.offeredPrice)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Seller</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold">
                        {request.sellerId?.name?.charAt(0) || "S"}
                      </div>
                      <p className="text-gray-900 font-medium">{request.sellerId?.name || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pickup Location</p>
                    <p className="text-gray-900 text-sm truncate flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {listing?.address || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-2">
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    View Details
                  </button>
                 
                  {request.status === "accepted" && (
                    <>
                      <button
                        onClick={() => handleContactSeller(request.sellerId)}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        📞 Contact Seller
                      </button>
                      <button
                        onClick={() => navigate(`/listings/${listing?._id}`)}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        View Listing
                      </button>
                    </>
                  )}
                  {request.status === "completed" && (
                    <button
                      onClick={() => navigate(`/reviews/new/${request._id}`)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      ⭐ Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-3 border-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-emerald-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Header */}
        <div className="mb-10 animate-fadeIn">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 mb-6 hover:border-gray-300"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                📋 Buyer Dashboard
              </div>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              My Requests
            </h1>
            <p className="text-gray-500 text-lg">Track and manage all your purchase requests in one place</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <StatCard title="Total Requests" value={stats.total} icon="📋" gradient="from-gray-600 to-gray-800" />
          <StatCard title="Pending" value={stats.pending} icon="⏳" gradient="from-amber-500 to-orange-500" trend="Awaiting Response" />
          <StatCard title="Accepted" value={stats.accepted} icon="✅" gradient="from-emerald-500 to-teal-500" trend="Ready to Connect" />
          <StatCard title="Completed" value={stats.completed} icon="🎉" gradient="from-blue-500 to-indigo-500" trend="Successfully Done" />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 pb-2 border-b border-gray-200">
          <FilterButton filter="all" label="All Requests" count={stats.total} />
          <FilterButton filter="pending" label="Pending" count={stats.pending} />
          <FilterButton filter="accepted" label="Accepted" count={stats.accepted} />
          <FilterButton filter="completed" label="Completed" count={stats.completed} />
          <FilterButton filter="rejected" label="Rejected" count={requests.filter(r => r.status === "rejected").length} />
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-gray-100 animate-fadeIn">
            <div className="relative inline-block">
              <div className="text-8xl mb-4 animate-bounce">📭</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Requests Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {activeFilter === "all" 
                ? "You haven't made any requests yet. Start exploring listings!" 
                : `No ${activeFilter} requests found`}
            </p>
            <button
              onClick={() => navigate("/listings")}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeInUp">
            {filteredRequests.map((request, index) => (
              <div key={request._id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slideUp">
                <RequestCard request={request} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Request Details
              </h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">✕</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Listing Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">📦</span>
                  Item Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Title</span>
                    <span className="font-medium text-gray-900">{selectedRequest.listingId?.title}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium">{getTypeInfo(selectedRequest.listingId?.type).text}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Condition</span>
                    <span className="font-medium capitalize">{selectedRequest.listingId?.condition}</span>
                  </div>
                  <div className="py-2">
                    <span className="text-gray-500 block mb-2">Description</span>
                    <p className="text-gray-700">{selectedRequest.listingId?.description}</p>
                  </div>
                </div>
              </div>

              {/* Request Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">📝</span>
                  Request Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Offered Price</span>
                    <span className="font-bold text-xl text-emerald-600">{formatPrice(selectedRequest.listingId?.type, selectedRequest.offeredPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedRequest.status).color}`}>
                      {getStatusBadge(selectedRequest.status).text}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Request Date</span>
                    <span className="text-gray-700">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-lg">👤</span>
                  Seller Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium text-gray-900">{selectedRequest.sellerId?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-700">{selectedRequest.sellerId?.email || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-gray-700">{selectedRequest.sellerId?.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-lg">📍</span>
                  Pickup Location
                </h3>
                <p className="text-gray-700">{selectedRequest.listingId?.address}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedRequest.status === "pending" && (
                  <button onClick={() => { handleCancelRequest(selectedRequest._id); setShowDetailsModal(false); }} className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl hover:from-rose-600 hover:to-red-600 transition-all duration-300 font-medium shadow-md">
                    Cancel Request
                  </button>
                )}
                <button onClick={() => { setShowDetailsModal(false); navigate(`/listings/${selectedRequest.listingId?._id}`); }} className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-medium shadow-md">
                  View Full Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Seller Modal */}
      {showContactModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl transform animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 h-32 rounded-t-3xl"></div>
            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="flex justify-center -mt-12 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                  {selectedSeller.name?.charAt(0).toUpperCase() || "S"}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">{selectedSeller.name}</h3>
              
              {/* Contact Info */}
              <div className="space-y-4 mb-8 mt-6">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Phone Number</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">📞</div>
                    <span className="text-gray-900 font-medium text-lg">{selectedSeller.phone || "Not provided"}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Email Address</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📧</div>
                    <span className="text-gray-700">{selectedSeller.email || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {/* ✅ UPDATED: Send Message button with full chat */}
                <button 
                  onClick={() => handleMessageSeller(
                    selectedSeller._id,
                    selectedSeller.name,
                    selectedRequest?.listingId?._id,
                    selectedRequest?._id
                  )} 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-md"
                >
                  💬 Send Message
                </button>
                <button onClick={() => setShowContactModal(false)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium">
                  Close
                </button>
              </div>

              {/* Safety Tip */}
              <div className="mt-5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-800 text-center flex items-center justify-center gap-2">
                  <span>🔒</span> Safety Tip: Meet in a public place and inspect items before paying
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default BuyerRequests;