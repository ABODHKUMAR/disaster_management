const express = require("express");
const router = express.Router();
const {
  createGeocoding
} = require("../controllers/geocodingController");

router.post("/", createGeocoding);

module.exports = router;