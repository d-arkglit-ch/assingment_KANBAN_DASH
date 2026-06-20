import { io } from "socket.io-client";

// Creates ONE persistent WebSocket connection to the backend
// Shared across the entire app so we never open multiple connections
const socket = io("http://localhost:5000");

export default socket;
