// ========== LOGIN LOGIC ==========
// VULNERABILITY: Hard-coded credentials + pure client-side authentication
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;

      if (user === 'admin' && pass === 'password123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
        document.getElementById('loginMessage').textContent = 'Login successful! Redirecting...';
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
      } else {
        document.getElementById('loginMessage').textContent = 'Invalid credentials';
      }
    });
  }

  // ========== PROFILE LOGIC ==========
  // VULNERABILITY: Data stored in localStorage + no output encoding (possible XSS)
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    const savedName = localStorage.getItem('displayName') || '';
    const savedBio = localStorage.getItem('bio') || '';
    document.getElementById('displayName').value = savedName;
    document.getElementById('bio').value = savedBio;

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('displayName').value;
      const bio = document.getElementById('bio').value;

      localStorage.setItem('displayName', name);
      localStorage.setItem('bio', bio);

      document.getElementById('savedProfile').innerHTML = `
        <h3>Saved Profile</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Bio:</strong> ${bio}</p>
      `;
    });
  }
});

// ========== AUTH CHECK ==========
// VULNERABILITY: Anyone can bypass this by changing localStorage
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const content = document.getElementById('dashboardContent');

  if (isLoggedIn === 'true') {
    const user = localStorage.getItem('username') || 'Student';
    content.innerHTML = `
      <p>Welcome back, <strong>${user}</strong>!</p>
      <p>This is the protected dashboard. In a real app this check would happen on the server.</p>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    content.innerHTML = `
      <p style="color:#f87171;">Access Denied. Please <a href="login.html">login</a> first.</p>
    `;
  }
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}