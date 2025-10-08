const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { mysqlPool } = require('../config/db');

// Register function ที่ครบถ้วน
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
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getLogin = (req, res) => {
  console.log('Rendering login page');
  res.render('login', {
    layout: 'login-layout', // บังคับใช้ login-layout
    title: 'Login',
    csrfToken: req.csrfToken(),
    error: req.flash('error'),
    success: req.flash('success')
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // ตรวจสอบว่ามีข้อมูล username และ password
    if (!username || !password) {
      req.flash('error', 'กรุณากรอก Username และ Password');
      return res.redirect('/login');
    }

    // ค้นหา user ในฐานข้อมูล
    const [rows] = await mysqlPool.query(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      req.flash('error', 'Username หรือ Password ไม่ถูกต้อง');
      return res.redirect('/login');
    }

    const user = rows[0];

    // ตรวจสอบ password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      req.flash('error', 'Username หรือ Password ไม่ถูกต้อง');
      return res.redirect('/login');
    }

    // Login สำเร็จ - สร้าง session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.isAuthenticated = true;

    console.log(`User ${username} logged in successfully`);
    req.flash('success', 'Login สำเร็จ');
    
    // Redirect ไปหน้า dashboard
    res.redirect('/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง');
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
};

// ฟังก์ชันสร้างผู้ใช้ admin อัตโนมัติ (เหลือแค่ฟังก์ชันเดียว)
exports.createDefaultAdminIfNotExists = async () => {
  try {
    const [rows] = await mysqlPool.query('SELECT id FROM users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await mysqlPool.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      
      console.log('Default admin user created');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
};
  try {
        } catch (error) {
          console.error('Error creating default admin:', error);
          throw error;
        }
      
