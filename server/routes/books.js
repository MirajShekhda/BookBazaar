const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, filterBooks } = require('../controllers/bookController');

router.get('/', getAllBooks);
router.get('/filter', filterBooks);
router.get('/:id', getBookById);

module.exports = router;