const Cart = require('../models/Cart');
const User = require('../models/User');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.user.id }).populate('bookId');
        res.json({ status: "ok", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        const userId = req.user.id;

        let cartItem = await Cart.findOne({ userId, bookId });
        
        if (cartItem) {
            cartItem.quantity += quantity || 1;
            await cartItem.save();
        } else {
            cartItem = new Cart({
                userId,
                bookId,
                quantity: quantity || 1
            });
            await cartItem.save();

            // Update user's cart array
            await User.findByIdAndUpdate(userId, {
                $push: { cart: cartItem._id }
            });
        }

        const updatedCart = await Cart.find({ userId }).populate('bookId');
        res.json({ status: "ok", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.updateCartQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await Cart.findById(req.params.id);
        
        if (!cartItem) {
            return res.status(404).json({ status: "error", message: "Cart item not found" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        const updatedCart = await Cart.find({ userId: req.user.id }).populate('bookId');
        res.json({ status: "ok", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ status: "error", message: "Cart item not found" });
        }

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { cart: cartItem._id }
        });

        await cartItem.remove();

        const updatedCart = await Cart.find({ userId: req.user.id }).populate('bookId');
        res.json({ status: "ok", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};