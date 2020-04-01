const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatCord Bot';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run When Client Connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        // Join User to the Chatroom     
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //Welcome the current users
        socket.emit('message', formatMessage(botName, "Welcome to ChatCord !"));

        //Broadcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName, `${user.username} has joined the chat`)
        );

        // Send Users and rrom info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    });


    // Listen Chat Messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        //emit the user's message
        socket.emit('message', formatMessage('You', msg));
        
        // Emit Room message
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(user.username, msg));
    });

    //Runs when a user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', 
            formatMessage(botName, `${user.username} has left the chat`));
            
            // Send Users and rrom info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running on port ${PORT}`))




