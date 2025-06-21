const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const path = require("path");
const express = require("express");

io.on('connection', socket => {
  console.log('User connected');
});

const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Fallback for React Router (SPA)
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
server.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port http://127.0.0.1:${process.env.PORT}`);
});
