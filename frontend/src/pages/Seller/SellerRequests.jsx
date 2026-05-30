import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const SellerRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSellerRequests();
  }, []);

  const fetchSellerRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/request/seller");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to accept this request?")) return;
    
    setActionLoading(true);
    try {
      const response = await api.patch(`/api/request/${requestId}/accept`);
      if (response.status === 200) {
        alert("Request accepted successfully!");
        fetchSellerRequests();
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    
    setActionLoading(true);
    try {
      const response = await api.patch(`/api/request/${requestId}/reject`);
      if (response.status === 200) {
        alert("Request rejected");
        fetchSellerRequests();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ NEW: Handle Message Buyer with complete chat creation
  const handleMessageBuyer = async (buyerId, buyerName, listingId, requestId) => {
    try {
      const response = await api.post("/api/chat", {
        receiverId: buyerId,
        listingId: listingId,
        requestId: requestId
      }, {
        withCredentials: true
      });
      
      navigate("/messages", { 
        state: { 
          chatId: response.data._id,
          otherUser: buyerName,
          otherUserId: buyerId
        } 
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      alert(error.response?.data?.message || "Could not start conversation");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: "⏳",
          text: "Pending"
        };
      case "accepted":
        return {
          color: "bg-green-100 text-green-800",
          icon: "✅",
          text: "Accepted"
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: "❌",
          text: "Rejected"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: "📦",
          text: status
        };
    }
  };

  const formatPrice = (type, price) => {
    if (type === "free") return "FREE";
    if (!price && price !== 0) return "Price Not Available";
    if (type === "donate") return `Donation: ₹${Number(price).toLocaleString()}`;
    return `₹${Number(price).toLocaleString()}`;
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "sell": return "💰";
      case "donate": return "🎁";
      case "free": return "🎉";
      default: return "📦";
    }
  };

  const getTypeText = (type) => {
    switch(type) {
      case "sell": return "For Sale";
      case "donate": return "For Donation";
      case "free": return "Free";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 mb-4"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Seller Requests
            </h1>
            <p className="text-gray-600">
              Manage all buyer requests for your listings
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Accepted</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter(r => r.status === "accepted").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Requests Yet
            </h3>
            <p className="text-gray-600 mb-6">
              No one has requested your items yet. Share your listings to get requests!
            </p>
            <button
              onClick={() => navigate("/create-listing")}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300"
            >
              + Add New Listing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              const listing = request.listingId;
              
              return (
                <div
                  key={request._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Listing Image */}
                      <div className="lg:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {listing?.images && listing.images[0] ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🪑
                          </div>
                        )}
                      </div>
                      
                      {/* Request Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {listing?.title || "Unknown Item"}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-500">
                                {getTypeIcon(listing?.type)} {getTypeText(listing?.type)}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">
                                Received: {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`px-4 py-2 rounded-full ${statusBadge.color} font-medium flex items-center gap-2`}>
                            <span>{statusBadge.icon}</span>
                            <span>{statusBadge.text}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Offered Price</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatPrice(listing?.type, request.offeredPrice)}
                            </p>
                            {listing?.type === "sell" && listing?.price !== request.offeredPrice && (
                              <p className="text-xs text-gray-400 mt-1">
                                Original: ₹{listing?.price?.toLocaleString()}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Buyer</p>
                            <p className="text-gray-900 font-medium">
                              {request.buyerId?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {request.buyerId?.phone || "No phone"}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Listing Price</p>
                            <p className="text-gray-900">
                              {formatPrice(listing?.type, listing?.price)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {request.status === "pending" && (
                          <div className="flex flex-wrap gap-3 mt-6">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              disabled={actionLoading}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                            >
                              ✅ Accept Request
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              disabled={actionLoading}
                              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                            >
                              ❌ Reject Request
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetailsModal(true);
                              }}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        )}
                        
                        {request.status === "accepted" && (
                          <div className="flex flex-wrap gap-3 mt-6">
                            {/* ✅ UPDATED: Message Buyer button with full chat */}
                            <button
                              onClick={() => handleMessageBuyer(
                                request.buyerId?._id,
                                request.buyerId?.name,
                                listing?._id,
                                request._id
                              )}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                              💬 Message Buyer
                            </button>
                            <button
                              onClick={() => navigate(`/listings/${listing?._id}`)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                            >
                              View Listing
                            </button>
                          </div>
                        )}
                        
                        {request.status === "rejected" && (
                          <div className="mt-6">
                            <button
                              onClick={() => navigate(`/listings/${listing?._id}`)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                            >
                              View Listing
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Request Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Listing Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Item Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p><span className="font-medium">Title:</span> {selectedRequest.listingId?.title}</p>
                  <p><span className="font-medium">Type:</span> {getTypeText(selectedRequest.listingId?.type)}</p>
                  <p><span className="font-medium">Condition:</span> {selectedRequest.listingId?.condition}</p>
                  <p><span className="font-medium">Original Price:</span> {formatPrice(selectedRequest.listingId?.type, selectedRequest.listingId?.price)}</p>
                  <p><span className="font-medium">Description:</span> {selectedRequest.listingId?.description}</p>
                </div>
              </div>
              
              {/* Buyer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Buyer Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedRequest.buyerId?.name}</p>
                  <p><span className="font-medium">Phone:</span> {selectedRequest.buyerId?.phone || "Not provided"}</p>
                  <p><span className="font-medium">Email:</span> {selectedRequest.buyerId?.email || "Not provided"}</p>
                </div>
              </div>
              
              {/* Request Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Request Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p><span className="font-medium">Offered Price:</span> {formatPrice(selectedRequest.listingId?.type, selectedRequest.offeredPrice)}</p>
                  <p><span className="font-medium">Status:</span> {selectedRequest.status}</p>
                  <p><span className="font-medium">Request Date:</span> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Pickup Location
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p>{selectedRequest.listingId?.address}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              {selectedRequest.status === "pending" && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      handleAcceptRequest(selectedRequest._id);
                      setShowDetailsModal(false);
                    }}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => {
                      handleRejectRequest(selectedRequest._id);
                      setShowDetailsModal(false);
                    }}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                  >
                    Reject Request
                  </button>
                </div>
              )}
              
              {selectedRequest.status === "accepted" && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleMessageBuyer(
                        selectedRequest.buyerId?._id,
                        selectedRequest.buyerId?.name,
                        selectedRequest.listingId?._id,
                        selectedRequest._id
                      );
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                  >
                    💬 Message Buyer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerRequests;