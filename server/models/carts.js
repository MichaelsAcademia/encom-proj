import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtAdd: { type: Number, required: true },
      }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);