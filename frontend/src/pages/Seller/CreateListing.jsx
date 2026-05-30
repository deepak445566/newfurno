import React, { useEffect, useState } from "react";
import api from "../../utils/axios"; // ✅ Using your api instance
import { useNavigate } from "react-router-dom";


const CreateListing = () => {
 const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    type: "sell",
    price: "",
    address: "",
    lat: "",
    lng: "",
  });
  const [images, setImages] = useState([]);


  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/listing/items/category");
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const preview = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(preview);
  };

  
  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    const updatedPreview = [...previewImages];
    updatedPreview.splice(index, 1);
    setImages(updatedImages);
    setPreviewImages(updatedPreview);
  };

  // ================= LOCATION =================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
        alert("📍 Location fetched!");
      },
      () => alert("Unable to fetch location")
    );
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    if (!formData.lat || !formData.lng) {
      alert("Please fetch your location");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("condition", formData.condition);
      data.append("type", formData.type);
      data.append("price", formData.type === "free" ? "0" : formData.price);
      data.append("address", formData.address);
      data.append("lat", formData.lat.toString());
      data.append("lng", formData.lng.toString());

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await api.post("/api/listing/create", data);
      console.log(response.data);
      alert("✅ Listing created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        condition: "",
        type: "sell",
        price: "",
        address: "",
        lat: "",
        lng: "",
      });
      setImages([]);
      setPreviewImages([]);
      
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
     <form
  onSubmit={handleSubmit}
  className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[430px_1fr] gap-8 pb-10"
>
  {/* LEFT SIDE */}
  <div className="space-y-6 lg:sticky lg:top-6 h-fit">
    
    {/* Back Button */}
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="group flex items-center gap-3 bg-white border border-gray-200 hover:border-black rounded-2xl px-5 py-4 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <span className="text-xl group-hover:-translate-x-1 transition">
        ←
      </span>
      <span className="font-semibold text-gray-800">Back</span>
    </button>

    {/* Upload Card */}
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-[32px] border border-gray-200 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
      
      {/* Glow Effect */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Create Listing
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Upload stunning product images
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl shadow-lg">
            ✨
          </div>
        </div>

        {/* Upload Area */}
        <div className="mt-7">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="imageUpload"
            onChange={handleImageUpload}
          />

          <label
            htmlFor="imageUpload"
            className="group relative overflow-hidden border-2 border-dashed border-gray-300 hover:border-black rounded-[30px] h-[280px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-white hover:bg-gray-50"
          >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition duration-300">
                📸
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Upload Images
              </h2>

              <p className="text-sm text-gray-400 mt-3">
                Drag & Drop or Click to Browse
              </p>

              <div className="mt-5 px-5 py-2 rounded-full bg-black text-white text-xs font-medium tracking-wide">
                PNG • JPG • WEBP
              </div>
            </div>
          </label>
        </div>

        {/* Preview */}
        {previewImages.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-8 mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                Uploaded Images
              </h3>

              <div className="text-sm bg-black text-white px-4 py-1.5 rounded-full">
                {previewImages.length} Photos
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {previewImages.map((img, index) => (
                <div
                  key={index}
                  className="group relative rounded-[24px] overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={img}
                    alt="Preview"
                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-black font-bold hover:bg-black hover:text-white transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="space-y-6">
    <div className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Product Details
          </h2>
          <p className="text-gray-500 mt-1">
            Fill all information carefully
          </p>
        </div>

        <div className="hidden md:flex w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center text-2xl">
          🛍️
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Title */}
        <div className="md:col-span-2">
          <label className="text-sm font-bold text-gray-700 block mb-3">
            Product Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Modern Wooden Chair"
            className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:border-black focus:bg-white outline-none transition-all duration-300"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-3">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:border-black outline-none"
            required
          >
            <option value="">Select Category</option>

            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-3">
            Condition
          </label>

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:border-black outline-none"
            required
          >
            <option value="">Select Condition</option>
            <option value="new">✨ Brand New</option>
            <option value="good">👍 Good Condition</option>
            <option value="used">🔄 Lightly Used</option>
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-3">
            Listing Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:border-black outline-none"
          >
            <option value="sell">💰 Sell - Earn cash</option>
            <option value="donate">🎁 Donate - Give back</option>
            <option value="free">🎉 Free - Help someone</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-3">
            {formData.type === "free"
              ? "Price"
              : formData.type === "sell"
              ? "Price (₹)"
              : "Donation Amount (₹)"}
          </label>

          {formData.type === "free" ? (
            <div className="w-full h-14 px-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center text-blue-600 font-bold">
              🎉 FREE
            </div>
          ) : (
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="₹ Enter amount"
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:border-black outline-none"
              required={formData.type !== "free"}
              min="0"
            />
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="text-sm font-bold text-gray-700 block mb-3">
            Pickup Address
          </label>

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address"
            className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:border-black outline-none"
            required
          />

          <button
            type="button"
            onClick={getCurrentLocation}
            className="mt-4 inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition"
          >
            📍 Use Current Location
          </button>

          {formData.lat && formData.lng && (
            <p className="text-sm text-green-600 mt-3 font-medium">
              ✓ Location captured successfully
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-bold text-gray-700 block mb-3">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            placeholder="Describe your product (material, dimensions, age, etc.)"
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-black outline-none resize-none"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || images.length === 0}
        className="group relative overflow-hidden w-full h-16 rounded-[24px] bg-black text-white text-lg font-bold mt-8 hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
      >
        <span className="relative z-10">
          {loading
            ? "Creating..."
            : `🚀 Create Listing ${
                images.length > 0
                  ? `(${images.length} image${
                      images.length > 1 ? "s" : ""
                    })`
                  : ""
              }`}
        </span>

        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition"></div>
      </button>

      {images.length === 0 && (
        <p className="text-center text-sm text-red-500 mt-4">
          Please upload at least one image
        </p>
      )}
    </div>
  </div>
</form>
    </div>
  );
};

export default CreateListing;