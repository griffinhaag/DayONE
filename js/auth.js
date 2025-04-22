document.addEventListener('DOMContentLoaded', () => {
    const userDisplay = document.getElementById('navbar-user');
    const currentUser = localStorage.getItem('loggedInUser');
  
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { username: 'grebleradmin', password: 'grebleradmin', role: 'admin' }
      ]));
    }
  
    if (currentUser && userDisplay) {
      userDisplay.innerHTML = `
        <span class="text-white me-3">Welcome, ${currentUser}</span>
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
  