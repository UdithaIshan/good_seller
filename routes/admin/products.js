const express = require('express');
const { validationResult } = require('express-validator');
const newTemplate = require('../../views/admin/product/new');
const { titleValidator, priceValidator } = require('../validations');

const router = express.Router();

router.get('/admin/products', (req,res) => {

});

router.get('/admin/products/new', (req, res) => {
    res.send(newTemplate({}));
});

router.post('/admin/products/new', [titleValidator, priceValidator], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    return res.send(newTemplate({}))
})

module.exports = router;