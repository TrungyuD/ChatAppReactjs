const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const user = {};
const users = {};
const socketToRoom = {};
const room = [];
io.on('connection', socket => {
    if (!user[socket.id]) {
        user[socket.id] = socket.id;
    }
    
    socket.emit("yourID", socket.id);
    socket.on("send message", body => {
        io.emit("message", body)
    })
    io.sockets.emit("allUsers", user);
    socket.on('disconnect', () => {
        delete user[socket.id];
        io.emit("user disconnect", user);
    })

    socket.on("create room ID", roomIds=>{
        room.push(roomIds);
        io.emit("create room IDs", room);
    })
    socket.on("join room", roomID => {
        if (users[roomID]) {
            // const length = users[roomID].length;
            // if (length === 4) {
            //     socket.emit("room full");
            //     return;
            // }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        socket.emit("all users", usersInThisRoom);


        console.log('users', users);
        console.log('roomID', roomID);
        console.log('socketToRoom', socketToRoom);
         
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        } 
        
        console.log('roomID', roomID);
        console.log('room', room);
        console.log('socket.id', socket.id);
        console.log('users[roomID]', users[roomID]);

        

    });



    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});

server.listen(8000, () => console.log('server is running on port 8000'));


