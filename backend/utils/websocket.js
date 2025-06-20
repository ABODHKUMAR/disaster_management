let io = null;

function initSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*", 
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


function emitDisasterUpdate(action, disaster) {
  if (!io) return;
  io.emit("disaster_updated", { action, disaster });
}


function emitSocialMediaUpdate(disasterId, posts) {
  if (!io) return;
  io.emit("social_media_updated", { disasterId, posts });
}


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
