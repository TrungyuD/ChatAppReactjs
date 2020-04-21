const express = require('express')
const app = express();
const expressServer = app.listen(5000, ()=>console.log("server is running on port 5000"));

const socket = require("socket.io");
const io=socket.listen(expressServer);

io.on("connection", socket => {
    socket.emit("your id", socket.id);
    socket.on("send message", body => {
        io.emit("message",body)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
})


