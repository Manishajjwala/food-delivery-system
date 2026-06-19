import { io } from "socket.io-client";

const SOCKET_URL = "food-delivery-system-xb0m.onrender.com"; // Adjust for production

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
