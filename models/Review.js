import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite error in Next.js
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;