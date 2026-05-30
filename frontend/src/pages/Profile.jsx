import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axios";

const Profile = () => {
  const navigate = useNavigate(); // Add this hook
  const { user, logout, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [addressTimeout, setAddressTimeout] = useState(null);
  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || "",
    lat: user?.location?.coordinates?.[1] || "",
    lng: user?.location?.coordinates?.[0] || ""
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-white to-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  // Function to get coordinates from address automatically
  const fetchCoordinatesFromAddress = async (address) => {
    if (!address || address.trim() === "") {
      return;
    }

    setFetchingLocation(true);
    
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: address,
          format: "json",
          limit: 1
        },
        headers: {
          'User-Agent': 'YourAppName/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lon);
        
        setFormData(prev => ({
          ...prev,
          lat: lat,
          lng: lng
        }));
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setFetchingLocation(false);
    }
  };

  // Handle address change with debounce (waits for user to stop typing)
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    
    setFormData({
      ...formData,
      address: newAddress
    });

    // Clear previous timeout
    if (addressTimeout) {
      clearTimeout(addressTimeout);
    }

    // Set new timeout to fetch location after 1 second of no typing
    if (newAddress.trim().length > 5) {
      const timeout = setTimeout(() => {
        fetchCoordinatesFromAddress(newAddress);
      }, 1000); // Waits 1 second after user stops typing
      
      setAddressTimeout(timeout);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put("/api/user/update", formData);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
      
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        
        // Also try to get address from coordinates (reverse geocoding)
        getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        
        setFetchingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your location. Please allow location access.");
        setFetchingLocation(false);
      }
    );
  };

  // Reverse geocoding: Get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: lat,
          lon: lng,
          format: "json"
        },
        headers: {
          'User-Agent': 'YourAppName/1.0'
        }
      });

      if (response.data && response.data.display_name) {
        setFormData(prev => ({
          ...prev,
          address: response.data.display_name
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    return user?.phone && 
           user?.address && 
           user?.location?.coordinates?.[0] && 
           user?.location?.coordinates?.[1];
  };

  // Handle go to dashboard
  const handleGoToDashboard = () => {
    navigate("/userdashboard"); // Make sure this route matches your app
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Completion Banner */}
        {!isProfileComplete() && !isEditing && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please complete your profile by adding phone number, address, and location coordinates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header with Green Gradient */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-green-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* User Title */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-green-100 mt-1 capitalize">{user.role}</p>
                <p className="text-green-100 text-sm mt-2">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
                {isProfileComplete() && (
                  <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                    ✓ Profile Complete
                  </span>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            
            {/* Edit Form */}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  {/* Avatar URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  {/* Address - Auto fetches location when typed */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                      {fetchingLocation && (
                        <span className="ml-2 text-xs text-green-600">
                          <span className="animate-spin inline-block w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full mr-1"></span>
                          Fetching location...
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleAddressChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Type your address - coordinates will auto-fetch"
                        required
                      />
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                        title="Use my current location"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        Use My Location
                      </button>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      ✨ Just type your address - latitude & longitude will appear automatically!
                    </p>
                  </div>

                  {/* Latitude - Auto fills when address is typed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Auto fetches from address"
                      required
                    />
                  </div>

                  {/* Longitude - Auto fills when address is typed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Auto fetches from address"
                      required
                    />
                  </div>
                </div>

                {/* Preview Map (Optional) */}
                {formData.lat && formData.lng && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800 mb-2">📍 Location Preview:</p>
                    <a 
                      href={`https://www.openstreetmap.org/?mlat=${formData.lat}&mlon=${formData.lng}#map=15/${formData.lat}/${formData.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm underline"
                    >
                      View on Map → {formData.lat}, {formData.lng}
                    </a>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Stats Cards */}
                {user.rating && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                      <div className="text-2xl font-bold text-green-600">{user.rating.average || 0}</div>
                      <div className="text-sm text-gray-600 mt-1">Average Rating</div>
                      <div className="text-yellow-500 text-sm">
                        {"⭐".repeat(Math.floor(user.rating.average || 0))}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                      <div className="text-2xl font-bold text-green-600">{user.rating.count || 0}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                      <div className="text-2xl font-bold text-green-600 capitalize">{user.role}</div>
                      <div className="text-sm text-gray-600 mt-1">Account Type</div>
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Full Name</label>
                      <p className="text-gray-800 font-medium mt-1">{user.name || "Not provided"}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Email Address</label>
                      <p className="text-gray-800 font-medium mt-1">{user.email || "Not provided"}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Phone Number</label>
                      <p className="text-gray-800 font-medium mt-1">{user.phone || "Not provided"}</p>
                      {!user.phone && <p className="text-xs text-red-500 mt-1">⚠️ Required</p>}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Address</label>
                      <p className="text-gray-800 font-medium mt-1">{user.address || "Not provided"}</p>
                      {!user.address && <p className="text-xs text-red-500 mt-1">⚠️ Required</p>}
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                {user.location && user.location.coordinates ? (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Location
                    </h2>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <p className="text-gray-800">
                        <span className="font-medium">Coordinates:</span> Lat: {user.location.coordinates[1]}, Lng: {user.location.coordinates[0]}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <p className="text-yellow-800">⚠️ Location coordinates not set. Please edit your profile to add your location.</p>
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Account Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <label className="text-xs text-gray-500 uppercase font-semibold">User ID</label>
                      <p className="text-gray-800 font-medium mt-1 text-sm">{user._id}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <label className="text-xs text-gray-500 uppercase font-semibold">Last Updated</label>
                      <p className="text-gray-800 font-medium mt-1">{new Date(user.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons Container */}
            <div className="space-y-4">
              {/* Go to Dashboard Button - Only show when profile is complete and not editing */}
              {isProfileComplete() && !isEditing && (
                <div className="flex justify-center">
                  <button 
                    onClick={handleGoToDashboard}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    Go to Dashboard
                  </button>
                </div>
              )}

              {/* Complete Profile Button - Show when profile is incomplete and not editing */}
              {!isProfileComplete() && !isEditing && (
                <div className="flex justify-center">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Complete Your Profile
                  </button>
                </div>
              )}

              {/* Logout Button */}
              {!isEditing && (
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={logout}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;