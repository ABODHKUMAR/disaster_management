const mockPosts = [
  {
    post: "#floodrelief Need food in NYC",
    user: "citizen1",
    timestamp: "2025-06-17T14:20:00Z",
  },
  {
    post: "#earthquake Rescue needed at Hilltown",
    user: "reporter_bot",
    timestamp: "2025-06-17T14:22:10Z",
  },
  {
    post: "#floodrelief Water bottles provided at Central Park",
    user: "ngo_help",
    timestamp: "2025-06-17T14:23:00Z",
  },
  {
    post: "#volunteers Offering shelter in Delhi",
    user: "volunteer_raj",
    timestamp: "2025-06-17T14:25:00Z",
  },
  {
    post: "#fire Major wildfire reported in California forests",
    user: "alert_bot",
    timestamp: "2025-06-17T14:26:00Z",
  },
  {
    post: "#medical Need urgent medical help near Pune station",
    user: "help_request",
    timestamp: "2025-06-17T14:27:00Z",
  },
  {
    post: "#urgent Family stuck in flooded house in Chennai",
    user: "local_report",
    timestamp: "2025-06-17T14:28:00Z",
  },
  {
    post: "#quake Shaking felt in Himachal hills, update please",
    user: "himachal_watch",
    timestamp: "2025-06-17T14:29:00Z",
  },
  {
    post: "#hurricane High winds approaching Miami coast",
    user: "weather_updates",
    timestamp: "2025-06-17T14:30:00Z",
  },
  {
    post: "#cyclone Heavy rains in Kolkata due to cyclone Vayu",
    user: "east_zone_weather",
    timestamp: "2025-06-17T14:31:00Z",
  },
  {
    post: "#tornado Tornado alert in Oklahoma area, take shelter",
    user: "us_storm_center",
    timestamp: "2025-06-17T14:32:00Z",
  },
  {
    post: "#wildfire Evacuations underway in LA hills",
    user: "california_fire",
    timestamp: "2025-06-17T14:33:00Z",
  },
  {
    post: "#help Old couple needs rescue in Bihar flood zone",
    user: "rescue_tracker",
    timestamp: "2025-06-17T14:34:00Z",
  },
  {
    post: "#ambulance Stuck ambulance near Sector 21 Noida",
    user: "on_road_alert",
    timestamp: "2025-06-17T14:35:00Z",
  },
  {
    post: "#landslide Road blocked due to landslide in Uttarakhand",
    user: "mountain_news",
    timestamp: "2025-06-17T14:36:00Z",
  },
  {
    post: "#floods Relief supplies sent to Odisha flood victims",
    user: "state_relief",
    timestamp: "2025-06-17T14:37:00Z",
  },
  {
    post: "#delhiRelief Blankets and food available at Civic Center",
    user: "ngo_sahara",
    timestamp: "2025-06-17T14:38:00Z",
  },
  {
    post: "#quake Evacuating school children after tremor",
    user: "school_safety",
    timestamp: "2025-06-17T14:39:00Z",
  },
  {
    post: "#fire Fire near textile market in Surat",
    user: "citizen2",
    timestamp: "2025-06-17T14:40:00Z",
  },
  {
    post: "#floodrelief Need drinking water and torches in Nashik",
    user: "ground_volunteer",
    timestamp: "2025-06-17T14:41:00Z",
  },
  {
    post: "#volunteers Needed in Chennai flood shelters",
    user: "relief_call",
    timestamp: "2025-06-17T14:42:00Z",
  },
  {
    post: "#urgent Food packets required at primary school camp",
    user: "camp_lead",
    timestamp: "2025-06-17T14:43:00Z",
  },
  {
    post: "#medical Pregnant woman stranded during landslide",
    user: "field_doc",
    timestamp: "2025-06-17T14:44:00Z",
  },
  {
    post: "#flood Boat service arranged near Guwahati",
    user: "assam_update",
    timestamp: "2025-06-17T14:45:00Z",
  },
  {
    post: "#wildfire Smoke inhalation cases rising in Oregon",
    user: "medic_team",
    timestamp: "2025-06-17T14:46:00Z",
  },
];

function extractHashtags(text) {
  return text.match(/#\w+/g) || [];
}

async function fetchPostsByTags(tags) {
  const lowerTags = tags.split(" ").map((tag) => tag.trim().toLowerCase());

  return mockPosts.filter((post) => {
    const postTags = extractHashtags(post.post.toLowerCase()).map((tag) =>
      tag.replace(/^#/, "")
    );
    return postTags.some((tag) => lowerTags.includes(tag));
  });
}

module.exports = {
  fetchPostsByTags,
};
