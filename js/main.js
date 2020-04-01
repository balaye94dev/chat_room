const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

chatForm = document.getElementById('chat-form');

// Get Username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join Chat Room
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ( {room, users} ) => {
outPutRoomName(room);
outPutRoomUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outPutMessage(message);
    
    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message Submit 
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //Get Message Text
    const msg = e.target.elements.msg.value;

    // Emit Message Text to Server
    socket.emit('chatMessage', msg);

    // Clear Submit Form
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// OutPut Message to DOM
function outPutMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    chatMessages.appendChild(div);
};

// Add room name to DOM
function outPutRoomName(room) {
    roomName.innerText = room;
}

// Add List Users to DOM
function outPutRoomUsers(users) {
usersList.innerHTML = `
${users.map(user => `<li>${user.username}</li>`).join('')}
`;
}