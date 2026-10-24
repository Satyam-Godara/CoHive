import express from "express";
import 'dotenv/config';
// const http = require("http");
// const { Server } = require("socket.io");
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import messageRoute from "./routes/messageRoutes.js"
import cors from "cors";

const app = express();
app.use(express.json());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Non-browser tools (curl, Postman) may omit Origin.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// const server = http.createServer(app);

// const io = new Server(server,{})

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.get('/api/health', (_, res) => {
    res.status(200).json({status:"ok", time: new Date()});
})




connectDB();
// .then(()=>{
    app.listen(5000, () => {
        console.log("Server Running at http://localhost:5000");
    })
// })

