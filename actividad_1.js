class ProductManager {
  constructor(products = []) {
    this.products = products;
    this.nextProductId = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (this.products.some((product) => product.code === code)) {
      throw new Error('Ya existe un producto con el mismo código');
    }

    const nuevoProducto = {
      id: this.nextProductId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(nuevoProducto);

    return nuevoProducto;
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId);

    if (!product) {
      console.error('Producto no encontrado');
    }

    return product;
  }
}
