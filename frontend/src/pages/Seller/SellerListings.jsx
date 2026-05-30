import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const CATEGORIES = [
  { value: "chair", label: "🪑 Chair" },
  { value: "sofa", label: "🛋️ Sofa" },
  { value: "bed", label: "🛏️ Bed" },
  { value: "table", label: "📋 Table" },
  { value: "cupboard", label: "🗄️ Cupboard" },
  { value: "desk", label: "📚 Desk" },
  { value: "wardrobe", label: "👔 Wardrobe" },
  { value: "other", label: "📦 Other" },
];

const CONDITIONS = [
  { value: "new", label: "Brand New", icon: "✨" },
  { value: "good", label: "Good Condition", icon: "👍" },
  { value: "used", label: "Lightly Used", icon: "🔄" },
];

const TYPES = [
  { value: "sell", label: "Sell", icon: "💰" },
  { value: "donate", label: "Donate", icon: "🎁" },
  { value: "free", label: "Free", icon: "🎉" },
];

const SellerListings = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingListing, setEditingListing] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    type: "",
    price: "",
    address: "",
  });

  const [updating, setUpdating] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/api/listing/user/mylisting"
      );

      setListings(data.listings || data);
    } catch (error) {
      alert("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleEdit = (listing) => {
    setEditingListing(listing);

    setEditForm({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      condition: listing.condition,
      type: listing.type,
      price: listing.price,
      address: listing.address,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setUpdating(true);

    try {
      await api.put(
        `/api/listing/update/${editingListing._id}`,
        editForm
      );

      alert("Listing updated successfully!");

      setEditingListing(null);

      fetchListings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(
        `/api/listing/delete/${deleteId}`
      );

      alert("Listing deleted successfully!");

      setDeleteId(null);

      fetchListings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const formatPrice = (type, price) => {
    if (type === "free") return "FREE";

    if (type === "donate")
      return `Donation ₹${price}`;

    return `₹${price}`;
  };

  const getStatusStyle = (status) => {
    const styles = {
      active:
        "bg-green-100 text-green-700 border-green-200",
      sold: "bg-red-100 text-red-700 border-red-200",
      pending:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
    };

    return (
      styles[status] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">

          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-black mx-auto"></div>

          <p className="mt-4 text-gray-500">
            Loading Listings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-4 py-6 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <p className="uppercase tracking-[4px] text-xs text-gray-400 font-semibold">
              Dashboard
            </p>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              My Listings
            </h1>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Manage your furniture listings easily
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/create-listing")
            }
            className="h-14 px-6 rounded-2xl bg-black text-white font-semibold hover:scale-[1.03] transition-all duration-300 shadow-xl"
          >
            + Add New Listing
          </button>
        </div>

        {/* EMPTY */}
        {listings.length === 0 && (
          <div className="bg-white rounded-[34px] border border-gray-200 shadow-sm py-20 px-6 text-center">

            <div className="text-7xl mb-5">
              🪑
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No Listings Yet
            </h2>

            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              Start selling or donating your
              furniture and help others while
              earning money.
            </p>

            <button
              onClick={() =>
                navigate("/create-listing")
              }
              className="mt-8 h-14 px-8 rounded-2xl bg-black text-white font-semibold"
            >
              Create Listing
            </button>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

          {listings.map((listing) => (
            <div
              key={listing._id}
              className="group bg-white rounded-[26px] border border-gray-200 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
            >

              {/* IMAGE */}
              <div className="relative h-[160px] sm:h-[240px] overflow-hidden m-2 rounded-[22px] bg-gray-100">

                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                {/* TOP */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">

                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] sm:text-xs font-bold uppercase tracking-[2px]">
                    {listing.type}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full border text-[10px] sm:text-xs font-semibold capitalize backdrop-blur ${getStatusStyle(
                      listing.status
                    )}`}
                  >
                    {listing.status}
                  </span>
                </div>

                {/* PRICE */}
                <div className="absolute bottom-4 left-4">

                  <p className="text-white/70 text-[10px] uppercase tracking-[3px]">
                    Price
                  </p>

                  <h1 className="text-lg sm:text-3xl font-black text-white">
                    {formatPrice(
                      listing.type,
                      listing.price
                    )}
                  </h1>
                </div>
              </div>

              {/* CONTENT */}
              <div className="px-3 sm:px-5 pb-5 pt-1">

                {/* TITLE */}
                <div className="flex items-start justify-between gap-2">

                  <h2 className="text-sm sm:text-xl font-bold text-gray-900 line-clamp-1">
                    {listing.title}
                  </h2>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate(
                        `/listing/${listing._id}`
                      );
                    }}
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shrink-0"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
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

                {/* ADDRESS */}
                <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-1">
                  📍 {listing.address}
                </p>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-2 mt-5">

                  <button
                    onClick={() =>
                      handleEdit(listing)
                    }
                    className="flex-1 h-11 rounded-2xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-all"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteId(listing._id)
                    }
                    className="flex-1 h-11 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingListing && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() =>
            setEditingListing(null)
          }
        >

          <div
            className="bg-white rounded-[30px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between z-10">

              <h2 className="text-2xl font-black">
                Edit Listing
              </h2>

              <button
                onClick={() =>
                  setEditingListing(null)
                }
                className="text-3xl text-gray-400 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleUpdate}
              className="p-5 sm:p-6 space-y-5"
            >

              {/* IMAGE */}
              {editingListing.images?.[0] && (
                <div>

                  <label className="block text-sm font-semibold mb-3">
                    Current Image
                  </label>

                  <img
                    src={
                      editingListing.images[0]
                    }
                    alt=""
                    className="w-28 h-28 rounded-2xl object-cover border"
                  />

                  <p className="text-xs text-gray-400 mt-2">
                    Image cannot be changed
                  </p>
                </div>
              )}

              {/* TITLE */}
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Listing Title"
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-black/5"
                required
              />

              {/* SELECTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="h-14 px-4 rounded-2xl border border-gray-200 outline-none"
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {CATEGORIES.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                    >
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  name="condition"
                  value={editForm.condition}
                  onChange={handleEditChange}
                  className="h-14 px-4 rounded-2xl border border-gray-200 outline-none"
                  required
                >
                  <option value="">
                    Select Condition
                  </option>

                  {CONDITIONS.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                    >
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* TYPE + PRICE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  className="h-14 px-4 rounded-2xl border border-gray-200 outline-none"
                  required
                >
                  {TYPES.map((t) => (
                    <option
                      key={t.value}
                      value={t.value}
                    >
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>

                {editForm.type !== "free" ? (
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    placeholder="Price"
                    min="0"
                    className="h-14 px-4 rounded-2xl border border-gray-200 outline-none"
                    required
                  />
                ) : (
                  <div className="h-14 rounded-2xl bg-gray-100 flex items-center justify-center font-semibold text-gray-500">
                    FREE
                  </div>
                )}
              </div>

              {/* ADDRESS */}
              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                placeholder="Address"
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 outline-none"
                required
              />

              {/* DESCRIPTION */}
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows="4"
                placeholder="Description"
                className="w-full p-4 rounded-2xl border border-gray-200 outline-none resize-none"
                required
              />

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setEditingListing(null)
                  }
                  className="flex-1 h-14 rounded-2xl border border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 h-14 rounded-2xl bg-black text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {updating
                    ? "Updating..."
                    : "Update Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >

          <div
            className="bg-white rounded-[30px] max-w-md w-full p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3 className="text-2xl font-black text-gray-900">
              Delete Listing
            </h3>

            <p className="text-gray-500 mt-3 leading-relaxed">
              Are you sure you want to delete
              this listing? This action cannot
              be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">

              <button
                onClick={() =>
                  setDeleteId(null)
                }
                className="flex-1 h-12 rounded-2xl border border-gray-300 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 h-12 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerListings;