// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth'); // Import the verifyToken middleware

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout); 

module.exports = router;
