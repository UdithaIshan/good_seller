const express = require("express");
const multer = require("multer");

const { hanldeErrors, authCheck } = require("./middleware");
const { titleValidator, priceValidator } = require("../validations");

const productsRepo = require("../../repositories/products");

const productsNewTemplate = require("../../views/admin/product/new");
const productsListTemplate = require("../../views/admin/product/index");
const productEditTemplate = require("../../views/admin/product/edit");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", authCheck, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsListTemplate({ products }));
});

router.get("/admin/products/new", authCheck, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  authCheck,
  upload.single("image"),
  [titleValidator, priceValidator],
  hanldeErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", authCheck, async (req, res) => {
  const id = req.params.id;
  const product = await productsRepo.getOne(id);

  if (!product) {
    return res.send("Item is not found!");
  }

  res.send(productEditTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  authCheck,
  upload.single("image"),
  [titleValidator, priceValidator],
  hanldeErrors(productEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {

    const updates = req.body;

    if(req.file) {
        updates.image = req.file.buffer.toString('base64');
    }

    try {
        await productsRepo.update(req.params.id, updates);
    } catch (error) {
        return res.send('Item is not found!');
    }

    res.redirect('/admin/products');
    
  }
);

module.exports = router;
