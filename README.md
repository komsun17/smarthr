# Express AdminLTE Template

## โครงสร้างโปรเจกต์

```
express-adminlte/
├── app.js
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   └── userController.js      # ตัวอย่าง
├── middlewares/
│   └── checkAuth.js
├── models/
│   └── userModel.js           # ตัวอย่าง
├── public/
├── routes/
│   ├── api/
│   │   └── auth.js
│   └── web.js
├── views/
│   └── login.ejs
├── .env.example
├── .env
├── package.json
└── README.md
```

## วิธีติดตั้ง

1. ติดตั้ง dependencies  
   ```
   npm install
   ```

2. คัดลอกไฟล์ `.env.example` ไป `.env` และแก้ไขค่าตามต้องการ  
   ```
   cp .env.example .env
   ```

3. ตั้งค่า `SESSION_SECRET` และข้อมูลฐานข้อมูลใน `.env`

4. (ถ้ามี) สร้างฐานข้อมูลและตารางที่ต้องใช้

## วิธีใช้งาน

1. เริ่มต้นเซิร์ฟเวอร์  
   ```
   npm start
   ```
   หรือระบุพอร์ตเอง  
   ```
   PORT=4000 npm start
   ```

2. เข้าใช้งานที่ [http://localhost:3000](http://localhost:3000) (หรือพอร์ตที่ตั้งไว้)

## วิธีขยายระบบ

- เพิ่ม Model ใหม่ใน `models/`
- เพิ่ม Controller ใหม่ใน `controllers/`
- เพิ่ม Route ใหม่ใน `routes/`
- เพิ่ม View ใหม่ใน `views/`

### ตัวอย่าง Model: `models/userModel.js`

```js
// models/userModel.js
const { mysqlPool } = require('../config/db');

exports.findByUsername = async (username) => {
  const [rows] = await mysqlPool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

exports.createUser = async (username, passwordHash) => {
  const [result] = await mysqlPool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwordHash]);
  return result.insertId;
};
```

### ตัวอย่าง Controller: `controllers/userController.js`

```js
// controllers/userController.js
const userModel = require('../models/userModel');

exports.getUser = async (req, res) => {
  const user = await userModel.findByUsername(req.params.username);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  // hash password ก่อน (ตัวอย่างนี้ข้าม)
  const userId = await userModel.createUser(username, password);
  res.status(201).json({ id: userId });
};
```

## Script สำหรับ Initial Template

เพิ่มใน `package.json`:

```json
"scripts": {
  "start": "node app.js",
  "init:template": "echo 'Initial template setup complete!'"
}
```

> สามารถปรับเปลี่ยน script `init:template` ให้รันคำสั่ง setup อื่น ๆ ได้ตามต้องการ

---

## หมายเหตุ

- ระบบนี้ใช้ CSRF, session, และ security headers ด้วย Helmet
- สามารถขยายระบบได้ง่ายโดยเพิ่มไฟล์ในแต่ละโฟลเดอร์
- ตัวอย่าง Model/Controller ใช้ MySQL (mysql2/promise)
"# express-adminlte" 
"# smarthr" 
