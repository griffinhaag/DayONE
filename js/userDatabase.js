let users = [];

function loadUsersFromJSON() {
  const saved = localStorage.getItem('Members/users.json');
  users = saved ? JSON.parse(saved) : [];
}

function saveUsersToJSON() {
  localStorage.setItem('Members/users.json', JSON.stringify(users, null, 2));
}

function createUser(userObj) {
  const isFirstUser = users.length === 0;
  const userWithRole = {
    ...userObj,
    role: isFirstUser ? 'admin' : 'user'
  };
  users.push(userWithRole);
  saveUsersToJSON();
}

function updateUser(username, updatedData) {
  const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedData };
    saveUsersToJSON();
  }
}

function findUser(username) {
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

function deleteUser(username) {
  users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
  saveUsersToJSON();
}

function getAllUsers() {
  return users;
}

function isUserDBEmpty() {
  return users.length === 0;
}

// For exporting the file manually
function exportUsersJSON() {
  const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'users.json';
  link.click();
}

// Load users on initial page load
loadUsersFromJSON();

window.UserDB = {
  createUser,
  updateUser,
  findUser,
  deleteUser,
  getAllUsers,
  isUserDBEmpty,
  exportUsersJSON,
  saveUsersToJSON,
  loadUsersFromJSON
};
