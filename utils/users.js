const users = {};
const ROOM_LIMIT = 4;

function joinRoom(id, username, room) {
  let user = { username: username, room: room };
  users[id] = user;
  return user;
}

function leaveRoom(id) {
  const user = users[id];
  if (user) {
    delete users[id];
  }
  return user;
}

function getAllUsers() {
  return users;
}

function getCurrentUser(id) {
  return users[id];
}

module.exports = {
  joinRoom,
  leaveRoom,
  getAllUsers,
  getCurrentUser,
  ROOM_LIMIT
};