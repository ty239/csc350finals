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
-- Cricket Products
('Cricket Bat Professional', 
 'High-quality English willow cricket bat, perfect for professional players. Light weight and excellent balance.', 
 129.99, 15, 
 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600', 
 'cricket'),

('Cricket Ball Leather Red', 
 'Professional grade leather cricket ball, red color. Suitable for matches and practice.', 
 19.99, 50, 
 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600', 
 'cricket'),

('Cricket Helmet Protection', 
 'Protective cricket helmet with titanium grille. Lightweight and comfortable design with adjustable straps.', 
 79.99, 20, 
 'https://images.unsplash.com/photo-1593088351467-74eeb6f32f52?w=600', 
 'cricket'),

('Cricket Batting Gloves', 
 'Professional batting gloves with superior grip and protection. Made with premium quality leather.', 
 45.99, 25, 
 'https://images.unsplash.com/photo-1628253809864-e5c2b8a4d39b?w=600', 
 'cricket'),

('Cricket Leg Pads', 
 'Professional leg guards for cricket with lightweight design and maximum protection.', 
 89.99, 18, 
 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600', 
 'cricket'),

-- Basketball Products
('Basketball Official Size 7', 
 'Official size 7 basketball, suitable for indoor and outdoor play. Excellent grip and durability.', 
 34.99, 30, 
 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600', 
 'basketball'),

('Basketball Shoes High-Top', 
 'High-performance basketball shoes with excellent ankle support and cushioning. Available in multiple sizes.', 
 109.99, 20, 
 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600', 
 'basketball'),

('Basketball Jersey Pro', 
 'Professional basketball jersey. Breathable mesh fabric, moisture-wicking technology.', 
 49.99, 35, 
 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=600', 
 'basketball'),

('Basketball Hoop System', 
 'Adjustable height portable basketball hoop system. Weather-resistant and easy to assemble.', 
 299.99, 8, 
 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=600', 
 'basketball'),

('Basketball Training Set', 
 'Complete training set with cones, resistance bands, and agility ladder. Perfect for skill development.', 
 69.99, 22, 
 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600', 
 'basketball'),

-- Soccer Products
('Soccer Ball FIFA Approved', 
 'FIFA approved size 5 soccer ball. Premium quality, excellent for match play and training.', 
 44.99, 40, 
 'https://images.unsplash.com/photo-1614632537423-1e6c2e0f0d8d?w=600', 
 'soccer'),

('Soccer Cleats Professional', 
 'Lightweight soccer cleats with superior ball control. Comfortable fit for extended play.', 
 129.99, 25, 
 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600', 
 'soccer'),

('Soccer Goal Net Set', 
 'Portable soccer goal with weather-resistant net. Easy assembly, regulation size available.', 
 199.99, 10, 
 'https://images.unsplash.com/photo-1577223625816-7546f36993c6?w=600', 
 'soccer'),

('Soccer Shin Guards Elite', 
 'Professional shin guards with ankle protection. Lightweight carbon fiber construction.', 
 34.99, 50, 
 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600', 
 'soccer'),

('Soccer Training Jersey', 
 'Team training jersey set with shorts. Quick-dry fabric, multiple colors and sizes available.', 
 59.99, 30, 
 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600', 
 'soccer');
