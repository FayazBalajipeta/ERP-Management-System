const Product = require("../models/Product");

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// CREATE product
exports.createProduct = async (req, res) => {
  try {
    const { title, sku, price, stock } = req.body;

    if (!title || !sku || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = await Product.create({
      title,
      sku,
      price,
      stock,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.title = req.body.title ?? product.title;
    product.sku = req.body.sku ?? product.sku;
    product.price = req.body.price ?? product.price;
    product.stock = req.body.stock ?? product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
