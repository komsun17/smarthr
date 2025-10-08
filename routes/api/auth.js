const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

// API endpoints
router.post('/register', authController.register);
router.post('/login', authController.postLogin);

module.exports = router;
