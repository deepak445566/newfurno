import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    phone: { type: String, unique: true,minlength: 10 },

    role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
    avatar: { type: String },
    address: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
         type: [Number],
  default: [0, 0]
      },
    },

    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);
userSchema.index({ location: "2dsphere" });
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
