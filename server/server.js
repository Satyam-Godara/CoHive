const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoute = require("./routes/auth");

const app = express();


// const server = http.createServer(app);

// const io = new Server(server,{})

app.use("/api/auth", authRoute);

app.get('/api/health', (_, res) => {
    res.status(200).json({status:"ok", time: new Date()});
})




connectDB().then(()=>{
    app.listen(3000, () => {
        console.log("Server Running at http://localhost:3000");
    })
})

