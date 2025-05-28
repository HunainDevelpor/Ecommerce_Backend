const User = require('../models/User');
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
    }
    catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ message: 'Server error while fetching profile' });
  } 
}
