import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../products.css";
import { productsAPI } from "../../../Services/products_service";

function ProductDetails({ onLogout }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productsAPI.getOne(productId);
      setProduct(data);
    } catch (error) {
      setError(error.message || "Failed to load product");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  if (loading) {
    return (
      <div className="products-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="products-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ color: "red" }}>{error || "Product not found"}</p>
          <button onClick={handleBack} className="view-button" style={{ marginTop: "20px" }}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <header className="products-header">
        <h1>Product Details</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="product-details-container">
        <div className="product-details-card">
          <img 
            src={product.photoUrl || "https://via.placeholder.com/400"} 
            alt={product.name}
            className="product-details-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400";
            }}
          />
          <div className="product-details-info">
            <h2>{product.name}</h2>
            <p className="product-details-description">{product.description}</p>
            <p className="product-details-price">${product.price}</p>
            
            <div className="product-meta">
              <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>

            <div className="product-details-actions">
              <button onClick={handleBack} className="back-button">
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

