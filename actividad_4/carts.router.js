const express = require('express');
const router = express.Router();
const CartManager = require('./classes/cartManager');

const cartManager = new CartManager('./carts.json');

// Listar productos en un carrito por id de carrito
router.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cartId);

  if (cart) {
    const productsInCart = cart.products.map((item) => {
      const product = productManager.getProductById(item.product);
      return { ...product, quantity: item.quantity };
    });

    res.json(productsInCart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Agregar un producto al carrito por id de carrito y id de producto
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const { quantity } = req.body;

  const success = cartManager.addProductToCart(cartId, productId, quantity);

  if (success) {
    res.json({ message: 'Producto agregado al carrito exitosamente.' });
  } else {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
});

module.exports = router;
