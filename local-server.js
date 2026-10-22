require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD; 
const ADMIN_PASS = process.env.ADMIN_PASS;

// Ensure 'assets/uploads' directory exists for direct image uploads
const uploadDir = path.join(__dirname, 'assets', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for Direct Image Upload from Computer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'rc_' + Date.now() + ext);
    }
});
const upload = multer({ storage });

// Auto-Create Database & Tables
const initConnection = mysql.createConnection({
    host: 'localhost',
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    multipleStatements: true
});

const setupSQL = `
CREATE DATABASE IF NOT EXISTS reachcraft_db;
USE reachcraft_db;

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

CREATE TABLE IF NOT EXISTS client_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewer_name VARCHAR(100) NOT NULL,
    service_used VARCHAR(100) NOT NULL,
    rating INT NOT NULL DEFAULT 5,
    review_text TEXT NOT NULL,
    avatar_color VARCHAR(20) DEFAULT 'blue',
    status VARCHAR(20) DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(60) NOT NULL,
    category_label VARCHAR(80) NOT NULL,
    author VARCHAR(100) NOT NULL,
    read_time VARCHAR(40) DEFAULT '3 min read',
    image_url TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(60) NOT NULL,
    category_label VARCHAR(80) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    tags VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(80) PRIMARY KEY,
    setting_value TEXT NOT NULL
);
`;

initConnection.connect((err) => {
    if (err) {
        console.error(' MySQL Connection Error:', err.message);
        return;
    }
    initConnection.query(setupSQL, () => {
        // Add 'status' column to client_reviews if upgrading from older table
        initConnection.query(`ALTER TABLE client_reviews ADD COLUMN status VARCHAR(20) DEFAULT 'approved'`, () => {
            seedInitialData();
            initConnection.end();
        });
    });
});

const db = mysql.createPool({
    host: 'localhost',
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: 'reachcraft_db',
    waitForConnections: true,
    connectionLimit: 10
});

function seedInitialData() {
    db.query(`SELECT COUNT(*) AS cnt FROM client_reviews`, (err, rows) => {
        if (!err && rows[0].cnt === 0) {
            db.query(`INSERT INTO client_reviews (reviewer_name, service_used, rating, review_text, avatar_color, status) VALUES
                ('Hamza Tariq', 'Web Development', 5, 'Working with ReachCraft has been an outstanding experience. They designed our business website with exceptional quality, fast speed, and modern design!', 'navy', 'approved'),
                ('Usman Sheikh', 'Meta Ads & Social Media', 5, 'Extremely easy to work with! They took over our Meta Ads and social media management and helped us get consistent customer inquiries on WhatsApp.', 'blue', 'approved'),
                ('Bilal Ahmed', 'Custom Software & Branding', 5, 'ReachCraft built a custom billing and management solution for our setup along with our brand logo. Highly responsive and delivered right on time!', 'teal', 'approved')`);
        }
    });

    db.query(`SELECT COUNT(*) AS cnt FROM blog_posts`, (err, rows) => {
        if (!err && rows[0].cnt === 0) {
            db.query(`INSERT INTO blog_posts (title, category, category_label, author, read_time, image_url, excerpt, content) VALUES
                ('5 Must-Have Features Every Pakistani Business Website Needs to Generate Leads', 'web-software', 'Web Development', 'Asad Khalid', '3 min read', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', 'From under-2-second mobile load speed to one-click WhatsApp chat integration—discover what separates a brochure site from a sales machine.', '<p>A modern business website should load in under 2 seconds on mobile and guide visitors directly to your WhatsApp and inquiry funnel.</p><h4>Key Checklist:</h4><p>1. Fast Mobile Speed<br>2. Sticky WhatsApp Button<br>3. Verified Client Reviews<br>4. SEO Structure & Meta Pixel</p>'),
                ('How to Get High-Intent WhatsApp Leads Using Meta Ads on a Small Budget', 'marketing', 'Meta Ads', 'Furqan', '4 min read', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80', 'Learn how proper audience targeting, creative hooks, and WhatsApp funnel filtering help you attract real buyers.', '<p>You do not need a massive budget to get daily leads on WhatsApp. Proper Meta Ads Manager targeting and creative testing brings qualified buyers.</p>'),
                ('How AI Video Ads & Dynamic Reels Are Cutting Ad Costs by 50%', 'ai-creative', 'AI Video & Editing', 'Zohaib', '3 min read', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'Static posters are being ignored. See how AI-generated product commercials and fast-paced Reels grab attention.', '<p>We combine realistic AI product visuals and voiceovers with fast-paced Premiere Pro/After Effects editing to stop the scroll in the first 3 seconds.</p>')`);
        }
    });

    db.query(`SELECT COUNT(*) AS cnt FROM portfolio_projects`, (err, rows) => {
        if (!err && rows[0].cnt === 0) {
            db.query(`INSERT INTO portfolio_projects (title, category, category_label, image_url, description, tags) VALUES
                ('Restaurant Website & Online Ordering', 'web-software', 'Web Development', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', 'Modern responsive website with digital menu, table reservation, and direct WhatsApp order integration.', 'HTML/CSS/JS, WhatsApp Orders, Mobile First'),
                ('Real Estate Property Portal & Lead Funnel', 'web-software', 'Web Portal + Meta Ads', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80', 'Property listing platform with advanced search filters paired with targeted Meta Lead Ads.', 'Custom Portal, Lead Capture, Meta Pixel'),
                ('Business Inventory, POS & Billing System', 'web-software', 'Custom Software', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80', 'Custom web-based management software built with Node.js & SQL to track daily sales and invoices.', 'Node.js, MySQL, Admin Dashboard')`);
        }
    });

    const defaults = [
        ['primary_phone', '0310 6780072'],
        ['secondary_phone', '+92 301 0754505'],
        ['whatsapp_number', '923106780072'],
        ['email', 'reachcraft1@gmail.com'],
        ['office_hours', 'Office Hours: 9:00 AM – 8:00 PM'],
        ['location', 'Pakistan']
    ];
    defaults.forEach(([k, v]) => {
        db.query(`INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)`, [k, v]);
    });

    console.log('ReachCraft Database, Approval System & Upload Engine Ready!');
}

// ================= DIRECT IMAGE UPLOAD API =================
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'No image selected' });
    const fileUrl = `assets/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl: fileUrl });
});

// ================= ADMIN AUTHENTICATION =================
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS) {
        res.json({ success: true, token: 'rc_admin_verified_token' });
    } else {
        res.status(401).json({ success: false, error: 'Incorrect Admin Password!' });
    }
});

// ================= 1. REVIEWS API (WITH APPROVAL SYSTEM) =================
// Public website only gets 'approved' reviews; Admin gets ALL ('pending' + 'approved')
app.get('/api/reviews', (req, res) => {
    const isAdmin = req.query.all === 'true';
    const whereClause = isAdmin ? '' : `WHERE status = 'approved'`;
    const sql = `SELECT id, reviewer_name AS name, service_used AS service, rating, review_text AS text, avatar_color AS color, status, DATE_FORMAT(created_at, '%b %d, %Y') AS time FROM client_reviews ${whereClause} ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, reviews: results });
    });
});

app.post('/api/reviews', (req, res) => {
    const { name, service, rating, text, color, isAdmin } = req.body;
    // If added by Admin -> immediately 'approved'. If submitted by public visitor -> 'pending' for safety!
    const status = isAdmin ? 'approved' : 'pending';
    const sql = `INSERT INTO client_reviews (reviewer_name, service_used, rating, review_text, avatar_color, status) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, service, rating || 5, text, color || 'blue', status], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.status(201).json({ success: true, id: result.insertId, status });
    });
});

// Approve a Pending Review from Admin Panel
app.put('/api/reviews/:id/approve', (req, res) => {
    db.query(`UPDATE client_reviews SET status = 'approved' WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.delete('/api/reviews/:id', (req, res) => {
    db.query(`DELETE FROM client_reviews WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// ================= 2. BLOG ARTICLES API =================
app.get('/api/blogs', (req, res) => {
    db.query(`SELECT * FROM blog_posts ORDER BY id DESC`, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, blogs: results });
    });
});

app.post('/api/blogs', (req, res) => {
    const { title, category, category_label, author, read_time, image_url, excerpt, content } = req.body;
    const sql = `INSERT INTO blog_posts (title, category, category_label, author, read_time, image_url, excerpt, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [title, category, category_label, author, read_time || '3 min read', image_url, excerpt, content], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.status(201).json({ success: true, id: result.insertId });
    });
});

app.delete('/api/blogs/:id', (req, res) => {
    db.query(`DELETE FROM blog_posts WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// ================= 3. PORTFOLIO PROJECTS API =================
app.get('/api/projects', (req, res) => {
    db.query(`SELECT * FROM portfolio_projects ORDER BY id DESC`, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, projects: results });
    });
});

app.post('/api/projects', (req, res) => {
    const { title, category, category_label, image_url, description, tags } = req.body;
    const sql = `INSERT INTO portfolio_projects (title, category, category_label, image_url, description, tags) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [title, category, category_label, image_url, description, tags], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.status(201).json({ success: true, id: result.insertId });
    });
});

app.delete('/api/projects/:id', (req, res) => {
    db.query(`DELETE FROM portfolio_projects WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// ================= 4. CONTACT INQUIRIES API =================
app.get('/api/inquiries', (req, res) => {
    db.query(`SELECT *, DATE_FORMAT(created_at, '%b %d, %Y %h:%i %p') AS formatted_date FROM contact_inquiries ORDER BY id DESC`, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, inquiries: results });
    });
});

app.post('/api/contact', (req, res) => {
    const { name, phone, email, service, budget, message } = req.body;
    const sql = `INSERT INTO contact_inquiries (full_name, phone, email, service, budget, message) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, phone, email, service, budget || 'Not Specified', message], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.status(201).json({ success: true, inquiryId: result.insertId });
    });
});

app.delete('/api/inquiries/:id', (req, res) => {
    db.query(`DELETE FROM contact_inquiries WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// ================= 5. MANUAL SITE SETTINGS API =================
app.get('/api/settings', (req, res) => {
    db.query(`SELECT * FROM site_settings`, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        const settings = {};
        results.forEach(row => { settings[row.setting_key] = row.setting_value; });
        res.json({ success: true, settings });
    });
});

app.post('/api/settings', (req, res) => {
    const settings = req.body;
    Object.entries(settings).forEach(([key, val]) => {
        db.query(`INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`, [key, val, val]);
    });
    res.json({ success: true, message: 'Site settings updated!' });
});

app.listen(PORT, () => {
    console.log(` ReachCraft Website & Admin Panel running at http://localhost:${PORT}`);
    console.log(` Admin Panel URL: http://localhost:${PORT}/admin.html`);
});