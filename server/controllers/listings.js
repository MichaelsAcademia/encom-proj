import Listing from "../models/listings.js";
import User from "../models/users.js";

// ✅ GET /listings – Fetch all listings
export const getListings = async (req, res) => {

  const {
    limit = 0,
    offset = 0,
    category = null,
    seller = null,
    sort = false
  } = req.query;

  try {

    let query = Listing.find();

    if (limit) query = query.limit(parseInt(limit));
    if (offset) query = query.skip(parseInt(offset));
    if (category) query = query.where('category').equals(category);
    if (seller) query = query.where('sellerId').equals(seller);
    if (sort) query = query.sort({ createdAt: -1 });

    const listings = await query;
    const totalListings = await Listing.countDocuments();

    res.status(200).json({listings, total: totalListings });

  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    res.status(500).json({ message: "Error fetching listings", error: error.message });
  }
};

// Get Popular Listings
export const getPopularListings = async (req, res) => {
  try {
    const popularListings = await Listing.find().sort().limit(8).select("_id title price images");

    if (!popularListings) {
      return res.status(404).json({ message: "No popular listings found" });
    }

    res.status(200).json(popularListings);
  } catch (error) {
    console.error("❌ Error fetching popular listings:", error);
    res.status(500).json({ message: "Error fetching popular listings", error: error.message });
  }
}

// ✅ GET /listings/:id – Fetch single listing
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    console.error("❌ Error fetching listing:", error);
    res.status(500).json({ message: "Error fetching listing", error: error.message });
  }
};

// ✅ POST /listings – Create new listing
export const createListing = async (req, res) => {
  try {
    const { title, description, price, category, images, quantity, sellerId } = req.body;

    const validSellerId = await User.findById(sellerId);
    if (!validSellerId) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const newListing = await Listing.create({
      title,
      description,
      price,
      category,
      images,
      quantity,
      sellerId: validSellerId,
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error("❌ Listing creation error:", error);
    res.status(400).json({ message: "Error creating listing", error: error.message });
  }
};

// ✅ PUT /listings/:id – Update existing listing
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("❌ Error updating listing:", error);
    res.status(400).json({ message: "Error updating listing", error: error.message });
  }
};

// ✅ DELETE /listings/:id – Delete listing
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    await listing.deleteOne();
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    res.status(500).json({ message: "Error deleting listing", error: error.message });
  }
};
