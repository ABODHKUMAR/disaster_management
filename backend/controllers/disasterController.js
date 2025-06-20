const { supabase } = require("../supabase/supabaseClient");
const { emitResourcesUpdate } = require("../utils/websocket");
const { extractLocationFromText } = require("../services/geminiService");
const { geocodeLocation } = require("../services/openStreetMapService");
const { fetchPostsByTags } = require("../services/socialMediaService");
const { verifyDisasterImageService } = require("../services/geminiService");
const { getNearbyResources} = require("../services/supabaseService");
const { getCachedValue, setCachedValue } = require("../services/cacheService");
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require("crypto");

exports.createDisaster = async (req, res) => {
  try {
    const { title, location_name, description, tags, owner_id } = req.body;

    const hash = crypto.createHash("sha256").update(description).digest("hex");
    const locationCacheKey = `gemini:location:${hash}`;

    let extractedLocation = await getCachedValue(locationCacheKey);
    if (!extractedLocation) {
      extractedLocation = await extractLocationFromText(description);
      await setCachedValue(locationCacheKey, extractedLocation);
    }

    const { lat, lon } = await geocodeLocation(extractedLocation || location_name || "");
    const geographyPoint = lat && lon ? `POINT(${lon} ${lat})` : null;

    const payload = {
      title,
      location_name: extractedLocation || location_name,
      location: geographyPoint,
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

    const { data, error } = await supabase.from("disasters").insert(payload).select();
    if (error) throw error;

    emitDisasterUpdate("created", data[0]);

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

exports.Reports = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("disaster_id", id);
    if (error) throw error;
    console.log("Reports for disaster:", id, data);

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

    emitDisasterUpdate("disaster_updated", data[0]);
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDisaster = async (req, res) => {
  const { id } = req.params;

  try {
    const { error: reportError } = await supabase
      .from("reports")
      .delete()
      .eq("disaster_id", id);
    if (reportError) throw reportError;

    const { error: resourceError } = await supabase
      .from("resources")
      .delete()
      .eq("disaster_id", id);
    if (resourceError) throw resourceError;

    const { data, error: disasterError } = await supabase
      .from("disasters")
      .delete()
      .eq("id", id)
      .select();
    if (disasterError) throw disasterError;

    emitDisasterUpdate("disaster_deleted", data[0]);
    res.status(200).json({ message: "Disaster deleted", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getDisasterSocialMedia = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `social_media:${id}`;

  try {
    // Check cache first
    const cachedPosts = await getCachedValue(cacheKey);
    if (cachedPosts) {
      console.log(`Cache hit for disaster ${id}`);
      return res.status(200).json(JSON.parse(cachedPosts));
    }

    const { data: disaster, error } = await supabase
      .from("disasters")
      .select("title, tags")
      .eq("id", id)
      .single();

    if (error || !disaster) {
      return res.status(404).json({ error: "Disaster not found" });
    }

    const keywords = disaster.tags?.join(" ") || disaster.title;
    console.log(`Fetching social media posts for keywords: ${keywords}`);
    const posts = await fetchPostsByTags(keywords);
    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "No social media posts found" });
    }
    // Cache the posts for 1 hour
    await setCachedValue(cacheKey, JSON.stringify(posts), 3600);
    res.status(200).json(posts);
  } catch (error) {
    console.error(`Error fetching social media for disaster ${id}:`, error);
    res.status(500).json({ error: "Failed to fetch social media posts" });
  }
};

exports.getDisasterResources = async (req, res) => {
  const { id } = req.params;
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  const cacheKey = `resources:${id}:${lat}:${lon}`;

  try {
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const resources = await getNearbyResources(lat, lon);

    await setCachedValue(cacheKey, resources);
    emitResourcesUpdate(id, resources);

    res.status(200).json(resources);
  } catch (error) {
    console.error(`Error fetching resources for disaster ${id}:`, error);
    res.status(500).json({ error: "Failed to fetch nearby resources" });
  }
};



exports.getOfficialDisasterUpdates = async (req, res) => {
  const { id } = req.params;

  try {
    const updates = await getDisasterUpdates(id);
    res.status(200).json(updates);
  } catch (error) {
    console.error(`Error fetching official updates for disaster ${id}:`, error);
    res.status(500).json({ error: "Failed to fetch official updates" });
  }
};



exports.verifyDisasterImage = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    const result = await verifyDisasterImageService(imageUrl);

    if (!result.success) {
      return res.status(500).json({ error: result.error || "Verification failed" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(`Error verifying image for disaster ${id}:`, error);
    res.status(500).json({ error: "Failed to verify image" });
  }
};

exports.getDisasterOfficialUpdates = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `official_updates:${id}:indian_red_cross`;

  try {
    const cached = await getCachedValue(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const { data } = await axios.get("https://indianredcross.org/ircs/newsviews");
    const $ = cheerio.load(data);
    const news = [];

    $("li strong a").each((i, el) => {
      const link = $(el).attr("href");
      const text = $(el).text().trim();
      const fullLink = link.startsWith("http") ? link : `https://indianredcross.org${link}`;

      news.push({
        title: text,
        url: fullLink,
        source: "Indian Red Cross",
        published_at: null,
      });
    });

    await setCachedValue(cacheKey, news);
    return res.status(200).json(news);
  } catch (error) {
    console.error("Error scraping Indian Red Cross:", error.message);
    return res.status(500).json({ error: "Failed to fetch updates" });
  }
};



