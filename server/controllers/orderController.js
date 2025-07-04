const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('items.bookId')
            .sort({ createdAt: -1 });
        res.json({ status: "ok", orders });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentId } = req.body;
        const userId = req.user.id;

        const order = new Order({
            userId,
            items,
            totalAmount,
            paymentId
        });

        await order.save();

        // Update user's orders array
        await User.findByIdAndUpdate(userId, {
            $push: { orders: order._id }
        });

        // Clear user's cart
        const userCart = await Cart.find({ userId });
        await User.findByIdAndUpdate(userId, {
            $pull: { cart: { $in: userCart.map(item => item._id) } }
        });
        await Cart.deleteMany({ userId });

        res.json({ status: "ok", order });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.bookId');
        if (!order) {
            return res.status(404).json({ status: "error", message: "Order not found" });
        }
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ status: "error", message: "Not authorized" });
        }
        res.json({ status: "ok", order });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ status: "error", message: "Order not found" });
        }
        
        order.status = status;
        await order.save();
        
        res.json({ status: "ok", order });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};