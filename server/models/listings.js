import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "sold", "removed", "out of stock"],
      default: "available",
    },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
