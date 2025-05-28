const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await Product.getById(id);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  const {
    name,
    description,
    fullDescription,
    price,
    discount,
    rating,
    reviewCount,
    stock,
    category,
    brand,
    model,
    colors,
    variants,
    featured,
    createdAt,
    image,
    images
  } = req.body;
console.log(req.body);

  try {
    await Product.create(
      name,
      description,
      fullDescription,
      price,
      discount,
      rating,
      reviewCount,
      stock,
      category,
      brand,
      model,
      colors,
      variants,
      featured,
      createdAt,
      image,
      images
    );
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    fullDescription,
    price,
    discount,
    rating,
    reviewCount,
    stock,
    category,
    brand,
    model,
    colors,
    variants,
    featured,
    createdAt,
    image,
    images
  } = req.body;

  try {
    await Product.update(
      id,
      name,
      description,
      fullDescription,
      price,
      discount,
      rating,
      reviewCount,
      stock,
      category,
      brand,
      model,
      colors,
      variants,
      featured,
      createdAt,
      image,
      images
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.body;
  try {
    await Product.delete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
