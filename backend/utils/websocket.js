let io = null;

function initSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*", // You can restrict to your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
}

// Emit disaster-related events to all connected clients
function emitDisasterUpdate(action, disaster) {
  if (!io) return;
  io.emit("disaster_updated", { action, disaster });
}

// Emit when social media updates are fetched
function emitSocialMediaUpdate(disasterId, posts) {
  if (!io) return;
  io.emit("social_media_updated", { disasterId, posts });
}

// Emit when new resources are found nearby
function emitResourcesUpdate(disasterId, resources) {
  if (!io) return;
  io.emit("resources_updated", { disasterId, resources });
}

module.exports = {
  initSocket,
  emitDisasterUpdate,
  emitSocialMediaUpdate,
  emitResourcesUpdate,
};
