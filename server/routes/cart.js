const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCart, addToCart, updateCartQuantity, removeFromCart } = require('../controllers/cartController');

router.use(auth);

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/:id', updateCartQuantity);
router.delete('/:id', removeFromCart);

module.exports = router;