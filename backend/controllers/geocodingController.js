const { extractLocationFromText } = require("../services/geminiService");
const { geocodeLocation } = require("../services/openStreetMapService");

exports.createGeocoding = async (req, res) => {
  try {
    const {  description } = req.body;

    const extractedLocation = await extractLocationFromText(description);

    const { lat, lon } = await geocodeLocation(
      extractedLocation || location_name || ""
    );

    const geographyPoint = lat && lon ? `POINT(${lon} ${lat})` : null;


    return res.status(200).json({
      lat, 
        lon,
        geographyPoint
    });

  } catch (err) {
    console.error("Create disaster failed:", err);
    res.status(500).json({ error: err.message });
  }
};
