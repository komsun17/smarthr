const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const checkAuth = require('../middlewares/checkAuth');

console.log('Mounting web routes');

// หน้าแรก redirect ไปหน้า login
router.get("/", (req, res) => res.redirect("/login"));

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/dashboard", checkAuth, dashboardController.getDashboard);

module.exports = router;
