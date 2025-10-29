const API_BASE_URL = "http://localhost:3000";

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

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

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    return apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async ({ firstName, lastName, email, age,password }) => {
    return apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email,age,password}),      
    });
    
  },

  logout: async () => {
    return apiCall("/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};
