const users = [];

// Join User to Chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// User Leaves the chat 
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get Room Users
function getRoomUsers(room) {
    return users.filter(user => user.room = room);
}

// Get Current User
function getCurrentUser(id) {
    return users.find(user => user.id === id);

};

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };

