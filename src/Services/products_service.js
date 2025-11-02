const API_BASE_URL = "http://localhost:3000";

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // Only add Content-Type for JSON, not for FormData
  if (!options.isFormData) {
    config.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

// Products API functions
export const productsAPI = {
  getAll: async () => {
    return apiCall("/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  getOne: async (productId) => {
    return apiCall(`/products/${productId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  delete: async (productId) => {
    return apiCall(`/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  create: async (formData) => {
    return apiCall("/products", {
      method: "POST",
      isFormData: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
  },
};

