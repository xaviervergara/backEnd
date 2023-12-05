const express = require('express');
const path = require('path');

// Importar la clase ProductManager
const ProductManager = require('./backendProj-Xvergara/actividad_3');

const app = express();
const PORT = 3000;

const productManager = new ProductManager(
  './backendProj-Xvergara/actividad_3/products.json'
);

// root del servidor
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor de productos!');
});

//obtener todos los productos
app.get('/products', (req, res) => {
  const limit = req.query.limit;
  let products = productManager.getProducts();

  if (limit) {
    const limitValue = parseInt(limit);
    products = products.slice(0, limitValue);
  }

  res.json(products);
});

//obtener un producto por id
app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Init
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
