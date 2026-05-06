const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// ================= CREATE PROPERTY =================
router.post("/create", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Missing request body" });
    }

    // Parse payload if sent as string (FormData case)
    const body =
      typeof req.body.payload === "string"
        ? JSON.parse(req.body.payload)
        : req.body;

    const payload = {
      nic: body.nic,
      address: body.address,
      type: body.type,
      landSize: body.landSize,

      location: {
        lat: Number(body.location?.lat) || null,
        lng: Number(body.location?.lng) || null,
      },

      stories: body.type === "full" ? Number(body.stories) || null : undefined,
      rooms: body.type === "full" ? Number(body.rooms) || null : undefined,

      image:
        body.image ||
        "https://images.unsplash.com/photo-1582407947304-fd86f716?w=400&q=80",

      documents: Array.isArray(body.documents)
        ? body.documents.filter(Boolean)
        : [],

      verification: body.verification || "pending",
      valuation: body.valuation ? Number(body.valuation) : null,
      currency: body.currency || "LKR",
    };

    const data = await Property.create(payload);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Create property error:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= UPDATE VERIFICATION =================
router.patch("/verification/:id", async (req, res) => {
  try {
    const data = await Property.findByIdAndUpdate(
      req.params.id,
      { verification: req.body.verification },
      { new: true },
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE VALUATION =================
router.patch("/valuation/:id", async (req, res) => {
  try {
    const data = await Property.findByIdAndUpdate(
      req.params.id,
      { valuation: Number(req.body.valuation) },
      { new: true },
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


// ================= GET BY NIC =================
router.get("/nic/:nic", async (req, res) => {
  try {
    const data = await Property.find({ nic: req.params.nic });

    if (!data.length) {
      return res.status(404).json({ error: "No properties found for this NIC" });
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const data = await Property.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET ALL PROPERTIES =================
router.get("/", async (req, res) => {
  try {
    const data = await Property.find();

    if (!data.length) {
      return res.status(404).json({
        error: "No properties found",
      });
    }

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});