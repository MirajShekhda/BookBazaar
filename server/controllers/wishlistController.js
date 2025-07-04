const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.user.id }).populate('bookId');
        res.json({ status: "ok", wishlist });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        let wishlistItem = await Wishlist.findOne({ userId, bookId });
        
        if (!wishlistItem) {
            wishlistItem = new Wishlist({ userId, bookId });
            await wishlistItem.save();

            await User.findByIdAndUpdate(userId, {
                $push: { wishlist: wishlistItem._id }
            });
        }

        const updatedWishlist = await Wishlist.find({ userId }).populate('bookId');
        res.json({ status: "ok", wishlist: updatedWishlist });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const wishlistItem = await Wishlist.findById(req.params.id);
        if (!wishlistItem) {
            return res.status(404).json({ status: "error", message: "Wishlist item not found" });
        }

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { wishlist: wishlistItem._id }
        });

        await wishlistItem.remove();

        const updatedWishlist = await Wishlist.find({ userId: req.user.id }).populate('bookId');
        res.json({ status: "ok", wishlist: updatedWishlist });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};