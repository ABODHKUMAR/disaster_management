const axios = require("axios");
const { getCachedValue, setCachedValue } = require("./cacheService");

async function geocodeLocation(locationName) {
  const cacheKey = `nominatim:${locationName}`;
  const cached = await getCachedValue(cacheKey);
  if (cached) return cached;

  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: locationName,
      format: "geojson",
    },
    headers: {
      "User-Agent": "your-app-name/1.0/abodh5921@gmail.com",
    },
  });

  const feature = response.data?.features?.[0];
  if (!feature) {
    throw new Error("No geolocation found for the given location");
  }

  const result = {
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
  };

  await setCachedValue(cacheKey, result);
  return result;
}

module.exports = { geocodeLocation };
