const fs = require('fs');

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
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
    };

    this.products.push(newProduct);
    this.currentId++;
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    return this.products.find((product) => product.id === productId);
  }

  updateProduct(productId, updatedProduct) {
    const index = this.products.findIndex(
      (product) => product.id === productId
    );

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProducts();
      return true;
    }

    return false;
  }

  deleteProduct(productId) {
    const updatedProducts = this.products.filter(
      (product) => product.id !== productId
    );
    if (updatedProducts.length < this.products.length) {
      this.products = updatedProducts;
      this.saveProducts();
      return true;
    }

    return false;
  }
}

module.exports = ProductManager;
