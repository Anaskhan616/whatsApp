import { io } from "socket.io-client";

export const socket = io("http://localhost:5002", {
  autoConnect: false, // login ke baad connect karenge
  withCredentials: true,
});
