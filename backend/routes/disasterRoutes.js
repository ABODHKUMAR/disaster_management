const express = require("express");
const router = express.Router();
const {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster,
  getDisasterSocialMedia,
} = require("../controllers/disasterController");

router.post("/", createDisaster);

router.get("/", getDisasters);

router.put("/:id", updateDisaster);

router.delete("/:id", deleteDisaster);

router.get('/:id/social-media', getDisasterSocialMedia);
module.exports = router;
