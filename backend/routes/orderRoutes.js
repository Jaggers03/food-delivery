const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/orders
router.post('/', protect, [
  body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
], placeOrder);

// GET /api/orders/my
router.get('/my', protect, getMyOrders);

// GET /api/orders  [Admin]
router.get('/', protect, adminOnly, getAllOrders);

// PUT /api/orders/:id/status  [Admin]
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
