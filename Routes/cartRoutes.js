// // routes/cartRoutes.js
// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/cartController');
// const {verifyToken } = require('../middlewares/auth');

// router.get('/', verifyToken, cartController.getCart);
// router.post('/add', verifyToken, cartController.addToCart);
// router.post('/remove', verifyToken, cartController.removeFromCart);

// module.exports = router;

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, cartController.getCart);
router.post('/add', verifyToken, cartController.addToCart);
router.delete('/:productId', verifyToken, cartController.removeFromCart);
router.post('/clear', verifyToken, cartController.clearCart);
router.put('/:productId', verifyToken, cartController.updateQuantity)

module.exports = router;
