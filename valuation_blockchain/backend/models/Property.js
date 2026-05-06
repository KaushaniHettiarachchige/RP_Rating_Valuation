const mongoose = require("mongoose");

// ================= LOCATION =================
const LocationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

// ================= PROPERTY =================
const PropertySchema = new mongoose.Schema(
  {
    nic: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["land", "full"],
    },

    landSize: {
      type: Number,
      required: true,
    },

    location: {
      type: LocationSchema,
      required: true,
    },

    stories: {
      type: Number,
      default: null,
    },

    rooms: {
      type: Number,
      default: null,
    },

    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1582407947304-fd86f716?w=400&q=80",
    },

    documents: {
      type: [String],
      default: [],
    },

    verification: {
      type: String,
      enum: ["pending", "rejected", "verified"],
      default: "pending",
    },

    valuation: {
      type: Number,
      default: null,
    },

    currency: {
      type: String,
      default: "LKR",
      enum: ["LKR", "USD"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Property", PropertySchema);
