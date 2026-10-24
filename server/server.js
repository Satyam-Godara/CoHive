import express from "express";
import 'dotenv/config';
// const http = require("http");
// const { Server } = require("socket.io");
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.js";
import messageRoute from "./routes/messageRoutes.js"

const app = express();
app.use(express.json());

// const server = http.createServer(app);

// const io = new Server(server,{})

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

app.get('/api/health', (_, res) => {
    res.status(200).json({status:"ok", time: new Date()});
})




connectDB();
// .then(()=>{
    app.listen(3000, () => {
        console.log("Server Running at http://localhost:3000");
    })
// })

