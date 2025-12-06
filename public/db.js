// LocalStorage Database Helper
const DB = {
  // Initialize database with default data
  init() {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }
    if (!localStorage.getItem("products")) {
      // Add default products
      const products = [
        {
          id: 1,
          name: "Cricket Bat",
          description: "Professional cricket bat",
          price: 89.99,
          stock: 15,
          image:
            "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",
          category: "cricket",
        },
        {
          id: 2,
          name: "Cricket Ball",
          description: "Leather cricket ball",
          price: 12.99,
          stock: 50,
          image:
            "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600",
          category: "cricket",
        },
        {
          id: 3,
          name: "Cricket Helmet",
          description: "Protective helmet",
          price: 45.99,
          stock: 20,
          image:
            "https://images.unsplash.com/photo-1593766787879-e8c78e09a903?w=600",
          category: "cricket",
        },
        {
          id: 4,
          name: "Wicket Keeping Gloves",
          description: "Professional keeping gloves",
          price: 55.99,
          stock: 12,
          image:
            "https://images.unsplash.com/photo-1624526267659-e9a7b8b4e6a5?w=600",
          category: "cricket",
        },
        {
          id: 5,
          name: "Cricket Pads",
          description: "Leg protection pads",
          price: 39.99,
          stock: 18,
          image:
            "https://images.unsplash.com/photo-1593766787879-e8c78e09a903?w=600",
          category: "cricket",
        },
        {
          id: 6,
          name: "Basketball",
          description: "Official size basketball",
          price: 29.99,
          stock: 30,
          image:
            "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600",
          category: "basketball",
        },
        {
          id: 7,
          name: "Basketball Hoop",
          description: "Adjustable basketball hoop",
          price: 199.99,
          stock: 8,
          image:
            "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=600",
          category: "basketball",
        },
        {
          id: 8,
          name: "Basketball Shoes",
          description: "High-performance shoes",
          price: 129.99,
          stock: 25,
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
          category: "basketball",
        },
        {
          id: 9,
          name: "Basketball Jersey",
          description: "Team jersey",
          price: 34.99,
          stock: 40,
          image:
            "https://images.unsplash.com/photo-1577212017308-2e27ab7b1645?w=600",
          category: "basketball",
        },
        {
          id: 10,
          name: "Basketball Shorts",
          description: "Athletic shorts",
          price: 24.99,
          stock: 35,
          image:
            "https://images.unsplash.com/photo-1591258370814-01609b341790?w=600",
          category: "basketball",
        },
        {
          id: 11,
          name: "Soccer Ball",
          description: "FIFA approved ball",
          price: 24.99,
          stock: 45,
          image:
            "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600",
          category: "soccer",
        },
        {
          id: 12,
          name: "Soccer Cleats",
          description: "Professional cleats",
          price: 89.99,
          stock: 22,
          image:
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
          category: "soccer",
        },
        {
          id: 13,
          name: "Soccer Shin Guards",
          description: "Protective shin guards",
          price: 19.99,
          stock: 30,
          image:
            "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=600",
          category: "soccer",
        },
        {
          id: 14,
          name: "Soccer Goal Net",
          description: "Portable goal net",
          price: 149.99,
          stock: 10,
          image:
            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600",
          category: "soccer",
        },
        {
          id: 15,
          name: "Soccer Jersey",
          description: "Team soccer jersey",
          price: 39.99,
          stock: 28,
          image:
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600",
          category: "soccer",
        },
      ];
      localStorage.setItem("products", JSON.stringify(products));
    }
    if (!localStorage.getItem("currentUser")) {
      localStorage.setItem("currentUser", JSON.stringify(null));
    }
  },

  // User operations
  getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  },

  addUser(user) {
    const users = this.getUsers();
    users.push({ ...user, id: Date.now() });
    localStorage.setItem("users", JSON.stringify(users));
  },

  findUser(username) {
    return this.getUsers().find((u) => u.username === username);
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  },

  setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  },

  logout() {
    localStorage.setItem("currentUser", JSON.stringify(null));
    localStorage.removeItem("cart");
  },

  // Product operations
  getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
  },

  getProduct(id) {
    return this.getProducts().find((p) => p.id === id);
  },

  updateProductStock(id, newStock) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      product.stock = newStock;
      localStorage.setItem("products", JSON.stringify(products));
    }
  },
};

// Initialize on load
DB.init();
