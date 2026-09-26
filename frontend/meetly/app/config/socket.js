import { io } from "socket.io-client";

// Use the same backend URL as the authenticated API client.
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create a reusable socket instance that connects only when explicitly requested.
export const socket = io(SOCKET_URL, {
    autoConnect: false,
    // Include cookies when establishing the socket connection.
    withCredentials: true
});