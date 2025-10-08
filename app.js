require('dotenv').config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const authApiRoutes = require('./routes/api/auth');
const webRoutes = require('./routes/web');
const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const csurf = require('csurf');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Mounting app.js');

// ตรวจสอบว่า SESSION_SECRET ถูกตั้งค่าใน environment variables หรือไม่
if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET is not set in environment variables!');
  process.exit(1);
}

// ใช้ helmet เพื่อเพิ่ม HTTP headers ป้องกันช่องโหว่
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'self'", "'unsafe-inline'", "'unsafe-hashes'"], // allow inline event handlers
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"], // allow XHR/fetch/websocket to same origin
      // ...add more as needed
    }
  }
}));

// view engine
const VIEW_ENGINE = process.env.VIEW_ENGINE || "ejs";
app.set("view engine", VIEW_ENGINE);
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// static files
const STATIC_PATH = process.env.STATIC_PATH || "public";
app.use(express.static(path.join(__dirname, STATIC_PATH)));
app.use(express.static('public'));

// parse form data
app.use(express.urlencoded({ extended: true }));

// session store config
const sessionStore = new MySQLStore({
  host: process.env.MYSQL_HOST || 'localhost',
  port: 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'test'
});

// session ต้องมาก่อน
app.use(session({
  secret: process.env.SESSION_SECRET, // ใช้จาก env แทน "mysecret"
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // ใช้ https ใน production
    httpOnly: true
  }
}));

// เพิ่ม flash messages
app.use(flash());

// Middleware สำหรับส่ง flash messages ไปยัง views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
    next();
});

// API routes (ไม่ต้องใช้ csurf)
app.use('/api/auth', authApiRoutes);

// ใช้ csurf เฉพาะ web routes
app.use('/', csurf(), (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}, webRoutes);

// Error handler middleware (ควรอยู่ท้ายสุดของ middleware/route)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(process.env.NODE_ENV === 'production'
    ? 'Something went wrong!'
    : `Error: ${err.message}<br><pre>${err.stack}</pre>`);
});

// เพิ่มการ setup ฐานข้อมูลเบื้องต้น
const { createUsersTable } = require('./setup/createDatabase');

// Setup database เมื่อเริ่มต้น server
createUsersTable().catch(console.error);

// start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
