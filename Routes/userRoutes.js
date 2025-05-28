// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userConrtroller');
const { verifyToken } = require('../middlewares/auth');

router.get('/profile', verifyToken, userController.getProfile);

module.exports = router;
