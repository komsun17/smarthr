const { mysqlPool } = require('../config/db');
const bcrypt = require('bcrypt');

async function createUsersTable() {
  try {
    // สร้างตาราง users
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created successfully');

    // สร้างผู้ใช้ admin เริ่มต้น
    const [rows] = await mysqlPool.query('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await mysqlPool.query(
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
    console.error('Database setup error:', error);
  }
}

// รันฟังก์ชันถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
  createUsersTable().then(() => {
    console.log('Database setup completed');
    process.exit(0);
  });
}

module.exports = { createUsersTable };
