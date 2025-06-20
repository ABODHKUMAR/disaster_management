const express = require("express");
const router = express.Router();
const {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster,
  getDisasterSocialMedia,
  verifyDisasterImage,
  getDisasterResources
  , getDisasterOfficialUpdates,
  Reports
} = require("../controllers/disasterController");

router.post("/", createDisaster);

router.get("/", getDisasters);

router.put("/:id", updateDisaster);

router.delete("/:id", deleteDisaster);

router.get('/:id/social-media', getDisasterSocialMedia);

router.get('/:id/resources', getDisasterResources)

router.post('/:id/verify-image', verifyDisasterImage);

router.get('/:id/official-updates', getDisasterOfficialUpdates);

router.get('/:id/reports', Reports);
module.exports = router;
