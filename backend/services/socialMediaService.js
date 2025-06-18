// services/socialMediaService.js

// Sample mock data
const mockPosts = [
  { post: "#floodrelief Need food in NYC", user: "citizen1", timestamp: "2025-06-17T14:20:00Z" },
  { post: "#earthquake Rescue needed at Hilltown", user: "reporter_bot", timestamp: "2025-06-17T14:22:10Z" },
  { post: "#floodrelief Water bottles provided at Central Park", user: "ngo_help", timestamp: "2025-06-17T14:23:00Z" },
  { post: "#volunteers Offering shelter in Delhi", user: "volunteer_raj", timestamp: "2025-06-17T14:25:00Z" }
];

// Disaster-to-hashtags map
const hashtagMap = {
  'flood-nyc': ['#floodrelief', '#NYCFlood'],
  'earthquake-hilltown': ['#earthquake'],
  'delhi-volunteer': ['#volunteers', '#delhiRelief'],
};

// Get hashtags for a disaster ID
function getDisasterHashtags(disasterId) {
  return hashtagMap[disasterId] || ['#disaster'];
}

// Filter mock posts based on hashtags
async function fetchSocialMediaPosts(disasterId) {
  const hashtags = getDisasterHashtags(disasterId);

  const filtered = mockPosts.filter(post =>
    hashtags.some(tag =>
      post.post.toLowerCase().includes(tag.toLowerCase())
    )
  );

  return filtered;
}

module.exports = {fetchSocialMediaPosts};
