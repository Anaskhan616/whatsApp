import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5002"
    : "/";

export const socket = io(BASE_URL, {
  autoConnect: false,
  withCredentials: true,
});

// connect after login
export const connectSocket = (userId) => {
  if (!userId) return;

  socket.auth = { userId };

  if (!socket.connected) {
    socket.connect();
  }
};

// disconnect on logout
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// send typing event
export const sendTyping = (receiverId) => {
  socket.emit("typing", { receiverId });
};