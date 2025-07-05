const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getAllBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController');

router.use(adminAuth);

router.get('/books', getAllBooks);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

module.exports = router;