const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const ProductManager = require('./classes/productManager');
const CartManager = require('./classes/cartManager');
const productsRouter = require('./products.router');
const cartsRouter = require('./carts.router');

app.use(express.json());

// Montar el router de productos en la ruta /api/products
app.use('/api/products', productsRouter);

// Montar el router de carritos en la ruta /api/carts
app.use('/api/carts', cartsRouter);

// Crear instancias de las clases
const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

// root del servidor
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor de productos y carritos!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
