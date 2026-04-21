const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/authMiddleware');

// POST /api/cart/validate
// Validates cart items and returns updated prices from DB
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `Item "${item.name}" is no longer available` });
      }
      validatedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });
      totalAmount += menuItem.price * item.quantity;
    }

    res.json({ validatedItems, totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
