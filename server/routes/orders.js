const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    getOrders, 
    createOrder, 
    getOrderById, 
    updateOrderStatus 
} = require('../controllers/orderController');

router.use(auth);

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;