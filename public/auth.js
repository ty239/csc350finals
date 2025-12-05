// Check if already logged in
async function checkSession() {
  try {
    const response = await fetch("/api/session");
    const data = await response.json();

    if (
      data.loggedIn &&
      (window.location.pathname === "/login.html" ||
        window.location.pathname === "/register.html")
    ) {
      window.location.href = "products.html";
    }
  } catch (error) {
    console.error("Session check error:", error);
  }
}

// Register form handler
if (document.getElementById("registerForm")) {
  checkSession();

  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const errorMessage = document.getElementById("errorMessage");

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful! Please login.");
          window.location.href = "login.html";
        } else {
          errorMessage.textContent = data.error || "Registration failed";
        }
      } catch (error) {
        console.error("Registration error:", error);
        errorMessage.textContent = "An error occurred. Please try again.";
      }
    });
}

// Login form handler
if (document.getElementById("loginForm")) {
  checkSession();

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "products.html";
      } else {
        errorMessage.textContent = data.error || "Login failed";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  });
}
