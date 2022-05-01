const express = require("express");
const router = express.Router();
const Product = require("../model/Product");
const verify = require("./verifyToken");

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch(err) {
        res.json({ message: err });
    }
});

// Store product
router.post("/", verify, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    });

    try {
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch(err) {
        res.json({ message: err });
    }
});

// Get single product
router.get("/:productId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        res.status(200).json(product);
    } catch(err) {
        res.json({ message: err });
    }
});

// Delete single product
router.delete("/:productId", verify, async (req, res) => {
    try {
        const removedProduct = await Product.remove({ _id: req.params.productId });
        res.status(200).json({ removedProduct, message: "deleted" });
    } catch(err) {
        res.json({ message: err });
    }
});

// update single product
router.patch("/:productId", verify, async (req, res) => {
    try {
        const updatedProduct = await Product.updateOne(
            { _id: req.params.productId }, 
            { $set: {
                name: req.body.name,
                price: req.body.price
            } }
        );
        res.status(200).json({ updatedProduct, message: "updated" });
    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;