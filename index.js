// server.js
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const db  = require('./utils/db');
const authRoutes = require('./Routes/authRoutes');

// const userRoutes = require('./Routes/userRoutes');
const productRoutes = require('./Routes/productRoutes');
const cartRoutes = require('./Routes/cartRoutes');
// const orderRoutes = require('./Routes/orderRoutes');
// const paymentRoutes = require('./Routes/paymentRoutes');
// const { errorHandler } = require('./middleware/errorHandler');


const app = express();

// Connect to Database
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
    connection.release();  // important: release connection after checking
});
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/payments', paymentRoutes);

// Error handler
// app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
