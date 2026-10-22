-- 1. Create Database
CREATE DATABASE IF NOT EXISTS reachcraft_db;
USE reachcraft_db;

-- 2. Table for Contact / Quote Form Inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    service VARCHAR(100) NOT NULL,
    budget VARCHAR(80) DEFAULT 'Not Specified',
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table for Dynamic Client Reviews
CREATE TABLE IF NOT EXISTS client_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewer_name VARCHAR(100) NOT NULL,
    service_used VARCHAR(100) NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    review_text TEXT NOT NULL,
    avatar_color VARCHAR(20) DEFAULT 'blue',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Your Initial 3 Real Client Reviews
INSERT INTO client_reviews (reviewer_name, service_used, rating, review_text, avatar_color) VALUES
('Hamza Tariq', 'Web Development', 5, 'Working with ReachCraft has been an outstanding experience. They designed our business website with exceptional quality, fast speed, and modern design. Their team is genuinely attentive to every detail!', 'navy'),
('Usman Sheikh', 'Meta Ads & Social Media', 5, 'Extremely easy to work with! They took over our Meta Ads and social media management, brought wonderful creative ideas to the table, and helped us get consistent customer inquiries on WhatsApp.', 'blue'),
('Bilal Ahmed', 'Custom Software & Branding', 5, 'ReachCraft built a custom billing and management solution for our setup along with our brand logo. Highly responsive, clear communication on WhatsApp, and delivered right on time!', 'teal');

-- 4. Table for Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);