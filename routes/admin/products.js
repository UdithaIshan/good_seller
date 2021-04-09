const express = require('express');
const multer = require('multer');

const { hanldeErrors } = require('./middleware');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/product/new');
const productsListTemplate = require('../../views/admin/product/index');
const { titleValidator, priceValidator } = require('../validations');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', async (req,res) => {
    const products = await productsRepo.getAll();
    res.send(productsListTemplate({ products }));
});

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post(
    '/admin/products/new',
    upload.single('image'),
    [titleValidator, priceValidator],
    hanldeErrors(productsNewTemplate),
    async (req, res) => {

      const image = req.file.buffer.toString('base64');
      const { title, price } = req.body;
      await productsRepo.create({ title, price, image });
  
      res.redirect('/admin/products');
    }
);

module.exports = router;