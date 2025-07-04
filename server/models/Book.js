const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    discountPercent: {
        type: Number,
        required: true
    },
    imgSrc: {
        type: String,
        required: true
    },
    imgAlt: {
        type: String,
        required: true
    },
    badgeText: String,
    outOfStock: {
        type: Boolean,
        default: false
    },
    fastDelivery: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    genre: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);