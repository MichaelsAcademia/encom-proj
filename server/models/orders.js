import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
        quantity: { type: Number, required: true, min: 1 },
        priceAtCheckout: { type: Number, required: true },
      }
    ],
    total: { type: Number, default: 0 },
    status : {
      type: String,
      enum: ["ordered", "shipped", "delivered", "cancelled"],
      default: "ordered"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);