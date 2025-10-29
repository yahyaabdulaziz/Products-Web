import "../Products.css";

function Products({ onLogout }) {
  const products = [
    { id: 1, name: "Gaming Console", price: "$299.99", image: "🎮" },
    { id: 2, name: "Smartphone", price: "$499.99", image: "📱" },
    { id: 3, name: "Laptop Pro", price: "$1299.99", image: "💻" },
    { id: 4, name: "Smart Watch", price: "$399.99", image: "⌚" },
    { id: 5, name: "Headphones", price: "$159.99", image: "🎧" },
    { id: 6, name: "Camera", price: "$599.99", image: "📷" },
  ];

  return (
    <div className="products-container">
      <header className="products-header">
        <h1>Our Products</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-icon">{product.image}</div>
            <h3>{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;