import express from "express";
import { createMeeting, getMeeting, getMeetingStats, getSessionDetails, getUserSessions } from "../controllers/meetingController.js";
import { protect } from "../middleware/auth.js";

// Base router for all meeting-related endpoints.
const meetingRouter = express.Router()

// Create a new meeting for the authenticated user.
meetingRouter.post("/", protect, createMeeting);

// Return dashboard stats for the current user's meeting usage and plan.
meetingRouter.get("/stats", protect, getMeetingStats);

// Get all meetings a user has hosted or joined.
meetingRouter.get("/sessions", protect, getUserSessions);

// Get the detailed data for a specific session by ID.
meetingRouter.get("/sessions:id", protect, getSessionDetails);

// Get a single meeting by its meeting ID.
meetingRouter.get("/:meetingId", protect,getMeeting);

export default meetingRouter;