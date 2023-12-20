const express = require('express');
const productsRouter = express.Router();
const ProductManager = require('./classes/productManager');

const productManager = new ProductManager('./products.json');

// Listar todos los productos
productsRouter.get('/', (req, res) => {
  const limit = req.query.limit;
  let products = productManager.getProducts();

  if (limit) {
    const limitValue = parseInt(limit);
    products = products.slice(0, limitValue);
  }

  res.json(products);
});

// Obtener un producto por id
productsRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    available,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res
      .status(400)
      .json({ error: 'Todos los campos son obligatorios.' });
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    available,
    stock,
    category,
    thumbnails,
  };

  productManager.addProduct(newProduct);

  res.status(201).json(newProduct);
});

// Actualizar un producto por id
productsRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;

  const success = productManager.updateProduct(productId, updatedProduct);

  if (success) {
    res.json({ message: 'Producto actualizado exitosamente.' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto por id
productsRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  const success = productManager.deleteProduct(productId);

  if (success) {
    res.json({ message: 'Producto eliminado exitosamente.' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});
module.exports = productsRouter;
