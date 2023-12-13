const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
    this.currentId = this.calculateCurrentId();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
  }

  calculateCurrentId() {
    if (this.products.length === 0) {
      return 1;
    }

    const maxId = this.products.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }

  addProduct(product) {
    const newProduct = {
      id: this.currentId,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      available: product.available !== undefined ? product.available : true,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails || [],
    };

    this.products.push(newProduct);
    this.currentId++;
    this.saveProducts();
  }

  getProductById(productId) {
    return this.products.find((product) => product.id === productId);
  }
}

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.loadCarts();
    this.currentId = this.calculateCurrentId();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
  }

  calculateCurrentId() {
    if (this.carts.length === 0) {
      return 1;
    }

    const maxId = this.carts.reduce(
      (max, cart) => (cart.id > max ? cart.id : max),
      0
    );
    return maxId + 1;
  }

  addCart() {
    const newCart = {
      id: this.currentId,
      products: [],
    };

    this.carts.push(newCart);
    this.currentId++;
    this.saveCarts();

    return newCart;
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.getCartById(cartId);

    if (!cart) {
      return false;
    }

    const existingProduct = cart.products.find(
      (item) => item.product === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity,
      });
    }

    this.saveCarts();
    return true;
  }
}

const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

// manejo de productos
const productsRouter = express.Router();

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

//  prod por id
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

// montar el router de productos en la ruta /api/products
app.use('/api/products', productsRouter);

// rutas para el manejo de carritos
const cartsRouter = express.Router();

// llistar productos en un carrito por id de carrito
cartsRouter.get('/:cid', (req, res) => {
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
cartsRouter.post('/:cid/product/:pid', (req, res) => {
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

// Montar el router de carritos en la ruta /api/carts
app.use('/api/carts', cartsRouter);

// root del servidor
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor de productos y carritos!');
});

// init
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
