-- PostgreSQL Database Schema for Sports Equipment E-Commerce

-- Create database (run this separately if needed)
-- CREATE DATABASE sports_shop;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping cart table
CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed'
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert sample sports equipment products
INSERT INTO products (name, description, price, stock, image, category) VALUES
('Cricket Bat Professional', 'High-quality English willow cricket bat, perfect for professional players. Light weight and excellent balance.', 129.99, 15, 'https://cricketstoreonline.com/collections/cricket-bats?srsltid=AfmBOoqLVZqw1C8DXpONAa66BtFMSqEJGChrqiZDCO4wNGiNPRLj3Olr', 'cricket'),
('Cricket Ball Leather', 'Professional grade leather cricket ball, red color. Suitable for matches and practice.', 19.99, 50, 'https://trogoncricket.com/cdn/shop/articles/Cricket_Bat_buyers_guide_new_1f0d0cae-d085-4484-8033-d44182561c15.png?v=1759922624', 'cricket'),
('Cricket Helmet', 'Protective cricket helmet with titanium grille. Lightweight and comfortable design with adjustable straps.', 79.99, 8, 'https://images.unsplash.com/photo-1628974402541-078768c988f4?w=400&h=300&fit=crop', 'cricket'),
('Cricket Gloves', 'Professional batting gloves with superior grip and protection. Made with premium quality leather.', 45.99, 20, 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400&h=300&fit=crop', 'cricket'),
('Basketball Official Size', 'Official size 7 basketball, suitable for indoor and outdoor play. Excellent grip and durability.', 34.99, 25, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', 'basketball'),
('Basketball Shoes Pro', 'High-performance basketball shoes with excellent ankle support and cushioning. Available in multiple sizes.', 109.99, 12, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', 'basketball'),
('Basketball Jersey Set', 'Complete basketball uniform set including jersey and shorts. Breathable fabric, multiple sizes available.', 49.99, 30, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop', 'basketball'),
('Basketball Hoop Portable', 'Adjustable height portable basketball hoop system. Weather-resistant and easy to assemble.', 299.99, 5, 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=400&h=300&fit=crop', 'basketball'),
('Cricket Pads Professional', 'Professional leg guards for cricket with lightweight design and maximum protection.', 89.99, 10, 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400&h=300&fit=crop', 'cricket'),
('Basketball Training Cones', 'Set of 12 training cones for basketball drills and practice sessions.', 24.99, 0, 'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=400&h=300&fit=crop', 'basketball');
