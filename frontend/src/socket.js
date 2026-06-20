import { io } from "socket.io-client";

// Creates ONE persistent WebSocket connection to the backend
// Shared across the entire app so we never open multiple connections
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const socket = io(BACKEND_URL);

export default socket;
