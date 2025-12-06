let currentUser = null;
let allProducts = [];
let currentFilter = "all";

// Check authentication
async function checkAuth() {
  try {
    const response = await fetch("/api/session");
    const data = await response.json();

    if (!data.loggedIn) {
      window.location.href = "login.html";
      return;
    }

    currentUser = data.user;
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Welcome, ${currentUser.fullName}!`;
    loadProducts();
    updateCartCount();
  } catch (error) {
    console.error("Auth check error:", error);
    window.location.href = "login.php";
  }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// Load products
async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    allProducts = await response.json();
    displayProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// Display products
function displayProducts() {
  const productsGrid = document.getElementById("productsGrid");

  const filteredProducts =
    currentFilter === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === currentFilter);

  productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${
        product.name
      }" onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(
        product.name
      )}'">
                ${
                  product.stock === 0
                    ? '<div class="sold-out-badge">SOLD OUT</div>'
                    : ""
                }
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${parseFloat(
                      product.price
                    ).toFixed(2)}</span>
                    <span class="product-stock ${
                      product.stock === 0 ? "out-of-stock" : ""
                    }">
                        ${
                          product.stock === 0
                            ? "Out of Stock"
                            : `${product.stock} in stock`
                        }
                    </span>
                </div>
                ${
                  product.stock > 0
                    ? `
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                `
                    : `
                    <button class="btn btn-secondary" disabled>
                        Unavailable
                    </button>
                `
                }
            </div>
        </div>
    `
    )
    .join("");
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.category;
    displayProducts();
  });
});

// Add to cart
async function addToCart(productId) {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save to localStorage as backup
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item.product_id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ product_id: productId, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));

      alert("Product added to cart!");
      updateCartCount();
      loadProducts(); // Refresh to update stock display
    } else {
      alert(data.error || "Failed to add to cart");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    alert("An error occurred. Please try again.");
  }
}

// Update cart count
async function updateCartCount() {
  try {
    const response = await fetch("/api/cart");
    const cartItems = await response.json();
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;
  } catch (error) {
    console.error("Cart count error:", error);
  }
}

// Initialize
checkAuth();
