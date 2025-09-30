const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// Register route
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.postLogin);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
