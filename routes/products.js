const express = require('express');
const router = express.Router();

const productsRepo = require('../repositories/products');
const productsTemplate = require('../views/products/index');

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsTemplate({ products }));
});

module.exports = router;