const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const paymentController = require('../controllers/paymentController');

router.post('/', verifyToken, paymentController.initiatePayment);
router.put('/', verifyToken, paymentController.updatePayment);
router.get('/:orderId', verifyToken, paymentController.getPayment);

module.exports = router;
