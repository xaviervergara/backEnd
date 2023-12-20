const express = require('express');
const http = require('http'); // Importa el módulo http
const socketIO = require('socket.io'); // Importa el módulo socket.io
const exphbs = require('express-handlebars'); // Importa el módulo express-handlebars
const fs = require('fs');
const app = express();
const server = http.createServer(app); // Crea el servidor HTTP usando express
const io = socketIO(server); // Crea el servidor de socket.io utilizando el servidor HTTP

const PORT = 8080;
const ProductManager = require('./classes/productManager');
const CartManager = require('./classes/cartManager');
const productsRouter = require('./products.router');
const cartsRouter = require('./carts.router');

app.use(express.json());

// Configura Handlebars como el motor de plantillas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Monta el router de productos en la ruta /api/products
app.use('/api/products', productsRouter);

// Monta el router de carritos en la ruta /api/carts
app.use('/api/carts', cartsRouter);

// Crear instancias de las clases
const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

productManager.addProduct({
  title: 'Producto 1',
  description: 'Descripción del Producto 1',
  code: 'P1',
  price: 19.99,
  stock: 50,
});

productManager.addProduct({
  title: 'Producto 2',
  description: 'Descripción del Producto 2',
  code: 'P2',
  price: 29.99,
  stock: 30,
});

// Ruta para la vista en tiempo real
app.get('/realtimeproducts', (req, res) => {
  // Renderiza la vista realTimeProducts.handlebars
  res.render('realTimeProducts');
});

// Escucha eventos de conexión de sockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Puedes agregar lógica de manejo de eventos de sockets aquí
  // Por ejemplo, cuando un nuevo producto se agrega, puedes emitir un evento a los clientes conectados para actualizar la lista en tiempo real.
});

// root del servidor
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor de productos y carritos!');
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
