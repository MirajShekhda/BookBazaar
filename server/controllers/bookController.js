const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ status: "ok", books });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ status: "error", message: "Book not found" });
        }
        res.json({ status: "ok", book });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.filterBooks = async (req, res) => {
    try {
        const { genre, minPrice, maxPrice, rating, inStock, fastDelivery } = req.query;
        let query = {};

        if (genre) query.genre = genre;
        if (minPrice || maxPrice) {
            query.discountedPrice = {};
            if (minPrice) query.discountedPrice.$gte = Number(minPrice);
            if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
        }
        if (rating) query.rating = { $gte: Number(rating) };
        if (inStock === 'true') query.outOfStock = false;
        if (fastDelivery === 'true') query.fastDelivery = true;

        const books = await Book.find(query);
        res.json({ status: "ok", books });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({ status: "ok", book });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return res.status(404).json({ status: "error", message: "Book not found" });
        }
        res.json({ status: "ok", book });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ status: "error", message: "Book not found" });
        }
        res.json({ status: "ok", message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};