document.addEventListener('DOMContentLoaded', () => {
  const userDisplay = document.getElementById('navbar-user');
  const currentUser = localStorage.getItem('loggedInUser');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Initialize default admin only if users array is empty
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { username: 'grebleradmin', password: 'grebleradmin', role: 'admin' }
    ]));
  }

  const loggedUser = users.find(u => u.username === currentUser);

  if (currentUser && userDisplay) {
    const isAdmin = loggedUser?.role === 'admin';
    userDisplay.innerHTML = `
      <span class="text-white me-3">Welcome, ${currentUser}</span>
      ${isAdmin ? '<a href="credentials/admin.html" class="btn btn-outline-light me-2">Dashboard</a>' : ''}
      <a href="#" onclick="logout()" class="btn btn-outline-light">Logout</a>`;
  }
});

function login(username) {
  localStorage.setItem('loggedInUser', username);
  window.location.href = '../index.html';
}

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.reload();
}
