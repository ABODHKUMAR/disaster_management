const { supabase } = require("../supabase/supabaseClient");
const { emitDisasterUpdate } = require("../utils/websocket");
const { extractLocationFromText } = require("../services/geminiService");
const { geocodeLocation } = require("../services/openStreetMapService");
const { fetchSocialMediaPosts } = require("../services/socialMediaService");

exports.createDisaster = async (req, res) => {
  try {
    const { title, location_name, description, tags, owner_id } = req.body;

    // Step 1: Use Gemini to extract location from description
    const extractedLocation = await extractLocationFromText(description); // e.g., "Kolkata, India"

    // Step 2: Convert extracted location to coordinates
    const { lat, lon } = await geocodeLocation(extractedLocation || location_name || "");

    // Fallback if geocoding fails
    const geographyPoint = lat && lon ? `POINT(${lon} ${lat})` : null;

    // Step 3: Construct disaster payload
    const payload = {
      title,
      location_name: extractedLocation || location_name,
      location: geographyPoint, // GEOGRAPHY column
      description,
      tags,
      owner_id,
      created_at: new Date().toISOString(),
      audit_trail: [
        {
          action: "create",
          user_id: owner_id,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Step 4: Insert into Supabase
    const { data, error } = await supabase.from("disasters").insert(payload).select();

    if (error) throw error;

    // Step 5: Emit WebSocket update
    emitDisasterUpdate("created", data[0]);

    // Step 6: Respond to client
    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Create disaster failed:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getDisasters = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = supabase.from("disasters").select("*");
    if (tag) query = query.contains("tags", [tag]);

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("disasters")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;

    emitDisasterUpdate("updated", data[0]);
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("disasters")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    emitDisasterUpdate("deleted", data[0]);
    res.status(200).json({ message: "Disaster deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getDisasterSocialMedia = async (req, res) => {
  const { id } = req.params;

  try {

    const { data: disaster, error } = await supabase
      .from('disasters')
      .select('title, tags')
      .eq('id', id)
      .single();

    if (error || !disaster) {
      return res.status(404).json({ error: 'Disaster not found' });
    }

    const keywords = disaster.tags?.join(' ') || disaster.title;

    const posts = await fetchSocialMediaPosts(keywords);

    res.status(200).json(posts);
  } catch (error) {
    console.error(`Error fetching social media for disaster ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch social media posts' });
  }
};


const { fetchNearbyResources } = require('../services/supabaseService');

exports.getDisasterResources = async (req, res) => {
  const { id } = req.params;
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const resources = await fetchNearbyResources(lat, lon);
    res.status(200).json(resources);
  } catch (error) {
    console.error(`Error fetching resources for disaster ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch nearby resources' });
  }
};


const { getDisasterUpdates } = require('../services/cacheService');

exports.getOfficialDisasterUpdates = async (req, res) => {
  const { id } = req.params;

  try {
    const updates = await getDisasterUpdates(id);
    res.status(200).json(updates);
  } catch (error) {
    console.error(`Error fetching official updates for disaster ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch official updates' });
  }
};


const { verifyImageWithGemini } = require('../services/geminiService');

exports.verifyDisasterImage = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const result = await verifyImageWithGemini(imageUrl);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error verifying image for disaster ${id}:`, error);
    res.status(500).json({ error: 'Failed to verify image' });
  }
};


