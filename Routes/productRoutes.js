// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/get', productController.getAllProducts);
router.post('/add', productController.createProduct);
// router.get('/get/:id', productController.getProductById);
// router.put('/update/:id', productController.updateProduct);
// router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
