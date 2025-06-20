const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  console.log('User connected');
});
server.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port http://127.0.0.1:${process.env.PORT}`);
});
