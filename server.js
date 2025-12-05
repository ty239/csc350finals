const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000; // Always use 3000 internally, Nginx proxies from PORT env var

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// ============ API ROUTES ============

// User Registration
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;

    // Check if user exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      "INSERT INTO users (username, password, email, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username",
      [username, hashedPassword, email, fullName]
    );

    res.json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.fullName = user.full_name;

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check session
app.get("/api/session", (req, res) => {
  if (req.session.userId) {
    res.json({
      loggedIn: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        fullName: req.session.fullName,
      },
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY category, name"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get cart items
app.get("/api/cart", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.stock
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
      [req.session.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add to cart
app.post("/api/cart", requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists and has stock
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      productId,
    ]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.rows[0].stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Check if item already in cart
    const existingItem = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [req.session.userId, productId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      await pool.query(
        "UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, req.session.userId, productId]
      );
    } else {
      // Insert new item
      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [req.session.userId, productId, quantity]
      );
    }

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Update cart item quantity
app.put("/api/cart/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2", [
        id,
        req.session.userId,
      ]);
    } else {
      await pool.query(
        "UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3",
        [quantity, id, req.session.userId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// Remove from cart
app.delete("/api/cart/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2", [
      id,
      req.session.userId,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Checkout
app.post("/api/checkout", requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get cart items
    const cartItems = await client.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.stock
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = $1`,
      [req.session.userId]
    );

    if (cartItems.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check stock and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of cartItems.rows) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${item.name}` });
      }
      total += item.price * item.quantity;
      orderItems.push(item);
    }

    // Create order
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id",
      [req.session.userId, total]
    );
    const orderId = orderResult.rows[0].id;

    // Insert order items and update inventory
    for (const item of orderItems) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, item.price]
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query("DELETE FROM cart WHERE user_id = $1", [
      req.session.userId,
    ]);

    await client.query("COMMIT");

    // Send email notification
    const itemsList = orderItems
      .map(
        (item) =>
          `${item.name} - Quantity: ${item.quantity} - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const msg = {
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@sportsshop.com",
      subject: "New Order Received - Sports Shop",
      text: `${
        req.session.fullName
      } ordered the following items:\n\n${itemsList}\n\nTotal: $${total.toFixed(
        2
      )}`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Email error:", error);
      });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId,
      total,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Checkout failed" });
  } finally {
    client.release();
  }
});

// Serve index.php at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.php"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
