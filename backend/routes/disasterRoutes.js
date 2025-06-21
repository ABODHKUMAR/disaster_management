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
const {authenticateToken, authorizeRoles } = require("./../middleware/authMiddleware");

router.post("/", authenticateToken, authorizeRoles("admin"), createDisaster);

router.get("/", getDisasters);

router.put("/:id", authenticateToken, authorizeRoles("admin"), updateDisaster);

router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteDisaster);

router.get('/:id/social-media', getDisasterSocialMedia);

router.get('/:id/resources', getDisasterResources)

router.post('/:id/verify-image', verifyDisasterImage);

router.get('/:id/official-updates', getDisasterOfficialUpdates);

router.get('/:id/reports', Reports);
module.exports = router;
