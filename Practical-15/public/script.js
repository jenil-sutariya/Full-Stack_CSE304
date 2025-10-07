async function fetchProfile() {
    const res = await fetch('/api/profile');
    if (res.ok) {
        const data = await res.json();
        showProfile(data.user);
        return true;
    }
    return false;
}

function showProfile(user) {
    const auth = document.getElementById('auth');
    const profile = document.getElementById('profile');
    const nameEl = document.getElementById('profileName');
    const timeEl = document.getElementById('profileLoginTime');

    if (user) {
        auth.hidden = true;
        profile.hidden = false;
        nameEl.textContent = user.name;
        const dt = new Date(user.loginTime);
        timeEl.textContent = dt.toLocaleString();
    } else {
        profile.hidden = true;
        auth.hidden = false;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const input = document.getElementById('name');
    const errorEl = document.getElementById('loginError');
    errorEl.hidden = true;
    const name = input.value.trim();
    if (!name) {
        errorEl.textContent = 'Please enter your name';
        errorEl.hidden = false;
        return;
    }
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    if (res.ok) {
        const data = await res.json();
        showProfile(data.user);
        input.value = '';
    } else {
        const data = await res.json().catch(() => ({}));
        errorEl.textContent = data.error || 'Login failed';
        errorEl.hidden = false;
    }
}

async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    showProfile(null);
}

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

// On load, try restore session
fetchProfile();



