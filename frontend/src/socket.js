import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Adjust for production

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
