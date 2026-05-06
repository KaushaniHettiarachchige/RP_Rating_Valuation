const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

router.post("/create", async (req, res) => {
  try {
    const data = await Property.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/verification/:id", async (req, res) => {
  try {
    const data = await Property.findOneAndUpdate(
      { propertyId: req.params.id },
      { verification: req.body.verification },
      { new: true },
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/valuation/:id", async (req, res) => {
  try {
    const data = await Property.findOneAndUpdate(
      { propertyId: req.params.id },
      { valuation: req.body.valuation },
      { new: true },
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
