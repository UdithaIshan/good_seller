const express = require('express');
const cartRepo = require('../repositories/cart');
const productRepo = require('../repositories/products');
const cartTemplate = require('../views/cart/show');

const router = express.Router();

router.post('/cart/products', async (req, res) => {
    let cart;
    if(!req.session.cartID) {
        cart = await cartRepo.create({ items: [] });
        req.session.cartID = cart.id;
    }
    else {
        cart = await cartRepo.getOne(req.session.cartID);
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if(existingItem) {
        existingItem.quantity++;
    }
    else {
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartRepo.update(cart.id, { items: cart.items });

    res.redirect('/cart');
});

router.get('/cart', async (req, res) => {
    if(!req.session.cartID) {
        res.redirect('/');
    }

    const cart = await cartRepo.getOne(req.session.cartID);

    for(let item of cart.items) {
        const product = await productRepo.getOne(item.id);
        item.product = product;
    }

    res.send(cartTemplate({ items:cart.items }));
});

router.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;

    const cart = await cartRepo.getOne(req.session.cartID);
    const items = cart.items.filter((item) => item.id !== itemId);

    await cartRepo.update(req.session.cartID, { items });
    res.redirect('/cart');
});

module.exports = router;