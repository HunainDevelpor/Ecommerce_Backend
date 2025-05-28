// const Wishlist = require('../models/wishlist');

// exports.getWishlist = async (req, res) => {
//   try {
//     const items = await Wishlist.getWishlist(req.user.id);
//     res.status(200).json({ wishlist: items });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
//   }
// };

// exports.addToWishlist = async (req, res) => {
//   try {
//     const result = await Wishlist.addToWishlist(req.user.id, req.params.productId);
//     if (!result) return res.status(400).json({ message: 'Already in wishlist' });
//     res.status(200).json({ message: 'Added to wishlist' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
//   }
// };

// exports.removeFromWishlist = async (req, res) => {
//   try {
//     await Wishlist.removeFromWishlist(req.user.id, req.params.productId);
//     res.status(200).json({ message: 'Removed from wishlist' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
//   }
// };



//Version 2
const Wishlist = require('../models/wishlist');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlist(req.user.id);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const items = await Wishlist.getItems(wishlist.wishlist_id);
    // res.status(200).json({ wishlistId: wishlist.wishlist_id, items });
    res.status(200).json(items );
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.getWishlist(req.user.id);
    if (!wishlist) {
      const wishlistId = await Wishlist.createWishlist(req.user.id);
      wishlist = { wishlist_id: wishlistId };
    }

    await Wishlist.addItem(wishlist.wishlist_id, req.params.productId);
    res.status(200).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to wishlist', error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlist(req.user.id);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    await Wishlist.removeItem(wishlist.wishlist_id, req.params.productId);
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from wishlist', error: err.message });
  }
};
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlist(req.user.id);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    await Wishlist.clearWishlist(wishlist.wishlist_id);
    res.status(200).json({ message: 'Wishlist cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing wishlist', error: err.message });
  }
}
