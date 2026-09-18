import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { handleClerkWebhook } from "./controllers/webhookController.js";

const app  = express();

const allowedOrigins = process.env.ORIGINS.split(",")
app.use(cors({origin: "", Credentials: true}))
app.use(cookieParser())

app.use("/api/clerk", express.raw({type: "application/json"}), handleClerkWebhook)
app.use(express.json())
app.use(clerkMiddleware())

//* Connect to Neon & Initialize Tables
await initDB()

app.get("/", (req, res)=> res.send("API is LIVE!"))
const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
    
})