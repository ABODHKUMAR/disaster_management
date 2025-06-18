const { supabase } = require("../supabase/supabaseClient");

async function insertDisaster(disaster) {
  const { data, error } = await supabase.from("disasters").insert([disaster]).select();
  if (error) throw error;
  return data;
}

async function getDisastersByTag(tag) {
  const { data, error } = await supabase
    .from("disasters")
    .select("*")
    .contains("tags", [tag]);

  if (error) throw error;
  return data;
}

async function getNearbyResources(lat, lon, radius = 10000) {
  const { data, error } = await supabase.rpc("get_nearby_resources", {
    latitude: lat,
    longitude: lon,
    radius_meters: radius
  });

  if (error) throw error;
  return data;
}

module.exports = { insertDisaster, getDisastersByTag, getNearbyResources };
