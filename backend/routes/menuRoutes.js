const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/menu
router.get('/', getMenuItems);

// GET /api/menu/:id
router.get('/:id', getMenuItemById);

// POST /api/menu  [Admin only]
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
], createMenuItem);

// PUT /api/menu/:id  [Admin only]
router.put('/:id', protect, adminOnly, updateMenuItem);

// DELETE /api/menu/:id  [Admin only]
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
