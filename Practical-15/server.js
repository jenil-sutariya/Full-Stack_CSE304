import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'super-secret-session-key',
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60, // 1 hour
		},
	})
);

app.use(express.static(path.join(__dirname, 'public')));

// API: Login - create session
app.post('/api/login', (req, res) => {
	const { name } = req.body;
	if (!name || !name.trim()) {
		return res.status(400).json({ error: 'Name is required' });
	}
	req.session.user = {
		name: name.trim(),
		loginTime: new Date().toISOString(),
	};
	return res.json({ ok: true, user: req.session.user });
});

// API: Get profile - read session
app.get('/api/profile', (req, res) => {
	if (!req.session.user) {
		return res.status(401).json({ error: 'Not logged in' });
	}
	return res.json({ user: req.session.user });
});

// API: Logout - destroy session
app.post('/api/logout', (req, res) => {
	if (!req.session) {
		return res.json({ ok: true });
	}
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ error: 'Failed to logout' });
		}
		res.clearCookie('connect.sid');
		return res.json({ ok: true });
	});
});

// Fallback to index.html for root
app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});



