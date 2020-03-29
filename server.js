const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');


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
        .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    });


    // Listen Chat Messages
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });

    //Runs when a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server is running on port ${PORT}`))




