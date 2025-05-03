const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
  
    try {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      console.log(hashPassword);
  
      const newUser = await User.create(name, email, hashPassword);
  
      const token = jwt.sign(
        { id: newUser.insertId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30d' }
      );
  
      res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
  
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30d' }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  