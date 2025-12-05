let cartItems = [];

// Check authentication
async function checkAuth() {
  try {
    const response = await fetch("/api/session");
    const data = await response.json();

    if (!data.loggedIn) {
      window.location.href = "login.php";
      return;
    }

    loadCart();
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
    window.location.href = "login.php";
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// Load cart
async function loadCart() {
  try {
    const response = await fetch("/api/cart");
    cartItems = await response.json();
    displayCart();
  } catch (error) {
    console.error("Error loading cart:", error);
  }
}

// Display cart
function displayCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartContainer = document.getElementById("cartContainer");
  const emptyCart = document.getElementById("emptyCart");

  if (cartItems.length === 0) {
    cartContainer.style.display = "none";
    emptyCart.style.display = "block";
    return;
  }

  cartContainer.style.display = "block";
  emptyCart.style.display = "none";

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${
        item.name
      }" onerror="this.src='https://via.placeholder.com/100x100?text=Product'">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${parseFloat(item.price).toFixed(
                  2
                )}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, ${
        item.quantity - 1
      })" class="qty-btn">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${
        item.quantity + 1
      }, ${item.stock})" class="qty-btn">+</button>
            </div>
            <div class="cart-item-total">
                <p>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                <button onclick="removeItem(${
                  item.id
                })" class="btn-remove">Remove</button>
            </div>
        </div>
    `
    )
    .join("");

  updateSummary();
}

// Update quantity
async function updateQuantity(cartId, newQuantity, maxStock) {
  if (newQuantity < 1) {
    if (confirm("Remove this item from cart?")) {
      await removeItem(cartId);
    }
    return;
  }

  if (maxStock && newQuantity > maxStock) {
    alert(`Only ${maxStock} items available in stock.`);
    return;
  }

  try {
    const response = await fetch(`/api/cart/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      loadCart();
    } else {
      alert("Failed to update quantity");
    }
  } catch (error) {
    console.error("Update quantity error:", error);
    alert("An error occurred. Please try again.");
  }
}

// Remove item
async function removeItem(cartId) {
  try {
    const response = await fetch(`/api/cart/${cartId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadCart();
    } else {
      alert("Failed to remove item");
    }
  } catch (error) {
    console.error("Remove item error:", error);
    alert("An error occurred. Please try again.");
  }
}

// Update summary
function updateSummary() {
  const total = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  document.getElementById("subtotal").textContent = `$${total.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", async () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!confirm("Proceed with checkout?")) {
    return;
  }

  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert(
        `Order placed successfully! Total: $${data.total.toFixed(
          2
        )}\nOrder confirmation has been sent to the store owner.`
      );
      window.location.href = "products.php";
    } else {
      alert(data.error || "Checkout failed");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("An error occurred during checkout. Please try again.");
  }
});

// Initialize
checkAuth();
