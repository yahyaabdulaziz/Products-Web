import { useState, useRef } from "react";
import "../Pages/products/products.css";

function AddProductDialog({ isOpen, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
            const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    if (!selectedFile) {
      newErrors.photoUrl = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("description", formData.description);
    submitFormData.append("price", formData.price);
    submitFormData.append("photoUrl", selectedFile);

    await onSubmit(submitFormData);
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: "",
      description: "",
      price: "",
    });
    setSelectedFile(null);
    setPreview(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Add New Product</h2>
          <button className="dialog-close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dialog-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={errors.name ? "error-input" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
              className={errors.description ? "error-input" : ""}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.price ? "error-input" : ""}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="photoUrl">Product Image *</label>
            <div className="file-upload-container">
              {preview ? (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label htmlFor="photoUrl" className="file-upload-label">
                  <span className="upload-icon">📁</span>
                  <span>Choose Image</span>
                  <input
                    type="file"
                    id="photoUrl"
                    name="photoUrl"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="file-input"
                  />
                </label>
              )}
            </div>
            {errors.photoUrl && (
              <span className="error-text">{errors.photoUrl}</span>
            )}
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductDialog;

