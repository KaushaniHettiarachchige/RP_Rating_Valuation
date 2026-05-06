const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true, unique: true, index: true },
    nic: { type: String, required: true, index: true },

    address: String,
    type: String,
    landSize: Number,

    location: {
      lat: Number,
      lng: Number,
    },

    image: String,

    verification: {
      type: String,
      enum: ["pending", "rejected", "verified"],
      default: "pending",
    },

    valuation: { type: String, required: true },
    currency: { type: String, default: "LKR" },

    zone: String,
    sqFt: Number,
    buildingAge: Number,

    uploads: {
      ownershipDocs: [],
      propertyImages: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Property", PropertySchema);
