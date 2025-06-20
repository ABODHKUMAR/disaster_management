const express = require("express");
const router = express.Router();
const {
  createGeocoding,
  createGeocodingLocation
} = require("../controllers/geocodingController");

router.post("/", createGeocoding);
router.post("/location", createGeocodingLocation);

module.exports = router;