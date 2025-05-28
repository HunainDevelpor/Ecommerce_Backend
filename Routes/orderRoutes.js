// // routes/orderRoutes.js
// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// const { authenticate } = require('../middlewares/auth');

// router.post('/', authenticate, orderController.createOrder);
// router.get('/get', authenticate, orderController.getUserOrders);
// // router.get('/item', authenticate, orderController.getOrder);

// module.exports = router;

//Version 2
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, orderController.placeOrder);
router.get('/', verifyToken, orderController.getMyOrders);
router.get('/:orderId', verifyToken, orderController.getOrderDetails);

module.exports = router;
              
