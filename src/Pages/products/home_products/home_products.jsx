import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../products.css";
import { productsAPI } from "../../../Services/products_service";
import AddProductDialog from "../../../Components/AddProductDialog";  
function Products({ onLogout }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await productsAPI.getAll();
      setProducts(response.data || response);
    } catch (error) {
      setError(error.message || "Failed to load products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeletingId(productId);
      await productsAPI.delete(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      alert(error.message || "Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  const handleAddProduct = async (formData) => {
    try {
      setIsSubmitting(true);
      await productsAPI.create(formData);
      // Refresh products list after successful creation
      await fetchProducts();
      setIsDialogOpen(false);
    } catch (error) {
      alert(error.message || "Failed to add product");
      console.error("Error adding product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="products-container">
      <header className="products-header">
        <div className="header-content">
          <div className="title-section">
            <h1>Our Products</h1>
            <hr />
          </div>
          <button 
            className="add-product-button"
            onClick={() => setIsDialogOpen(true)}
          >
            <span className="button-icon">+</span>
            Add New Product
          </button>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.photoUrl || "https://via.placeholder.com/200"}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200";
                }}
              />
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <div className="product-actions">
                <button
                  className="view-button"
                  onClick={() => handleViewProduct(product.id)}
                >
                  View Details
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddProduct}
        loading={isSubmitting}
      />
    </div>
  );
}

export default Products;
