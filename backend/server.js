import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { handleClerkWebhook } from "./controllers/webhookController.js";
import meetingRouter from "./routes/meetingRoutes.js";
import http from "http"
import { Server } from "socket.io";
import { setupSocketIO } from "./socket.js";
import { error } from "console";

// Create the Express app and the underlying HTTP server.
const app  = express();
const server = http.createServer(app)

// Allow requests from the configured frontend origins.
const allowedOrigins = [...new Set([
    ...(process.env.ORIGINS || "http://localhost:3000").split(",").map((origin) => origin.trim()).filter(Boolean),
    "https://meetly-git-main-benjamin-darteys-projects.vercel.app",
])];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

// Clerk webhook endpoint must parse raw JSON before Express JSON middleware runs.
app.use("/api/clerk", express.raw({type: "application/json"}), handleClerkWebhook)
app.use(express.json())
app.use(clerkMiddleware())

// Initialize database tables and required app data on startup.
await initDB()

// Basic health check for deployment and debugging.
app.get("/", (req, res)=> res.send("API is LIVE!"))

// Attach meeting-related routes.
app.use("/api/meetings", meetingRouter)

// Initialize Socket.IO for real-time meeting updates and signaling.
const io = new Server(server, {
    cors: {origin: allowedOrigins, credentials: true}
})

setupSocketIO(io)

// Centralized error handler for unexpected server errors.
app.use((err, _req, res, _next)=> {
    console.error(`[Error] ${err.message}`);
    res.status(500).json({error: "Internal server error"});
    
})

const port = process.env.PORT || 5000;

// Start listening for incoming requests.
server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Close the stale process and try again.`);
        process.exit(1);
    }

    console.error("Server startup error:", error);
    process.exit(1);
});

server.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
});