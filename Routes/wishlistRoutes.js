const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, wishlistController.getWishlist);
router.post('/:productId', verifyToken, wishlistController.addToWishlist);
router.delete('/:productId', verifyToken, wishlistController.removeFromWishlist);
router.post('/clear', verifyToken, wishlistController.clearWishlist);

module.exports = router;
