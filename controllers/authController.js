const bcrypt = require('bcrypt');
const { mysqlPool } = require('../config/db');

// Register
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const [rows] = await mysqlPool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    await mysqlPool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getLogin = async (req, res, next) => {
  try {
    res.render("login", { title: "Login", csrfToken: req.csrfToken() });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [rows] = await mysqlPool.query('SELECT id, password FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.render("login", { title: "Login", error: "Invalid username or password", csrfToken: req.csrfToken() });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", { title: "Login", error: "Invalid username or password", csrfToken: req.csrfToken() });
    }
    req.session.user = { id: user.id, username };
    req.session.save(() => {
      // หลัง save session แล้วค่อย redirect (refresh CSRF token ที่หน้า dashboard)
      res.redirect("/dashboard");
    });
  } catch (err) {
    res.render("login", { title: "Login", error: "Database error", csrfToken: req.csrfToken() });
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      // เคลียร์ cookie ด้วย
      res.clearCookie('connect.sid');
      // redirect ไป login (refresh CSRF token)
      res.redirect("/login");
    });
  } catch (err) {
    next(err);
  }
};
