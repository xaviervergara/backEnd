const fs = require('fs');

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

module.exports = CartManager;
