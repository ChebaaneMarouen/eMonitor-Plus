const { socketConf } = require("../config");
const io = require("socket.io-client");

const socket = io(socketConf.host, { path: socketConf.path });
export function getSocket() {
  return socket;
}
export function start() {
  socket.emit("user-room", {});
  socket.on("connect", () => {
    socket.emit("user-room", {});
  });
  return socket;
}
