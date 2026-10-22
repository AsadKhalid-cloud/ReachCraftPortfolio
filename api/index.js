require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TiDB Cloud Online MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.TIDB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: process.env.TIDB_USER || '3n6Wmc1upN2tyYj.root',
    password: process.env.TIDB_PASSWORD, // Ye Vercel Environment Variable & .env se aayega!
    database: 'test', // TiDB Cloud ka default ready database 'test' hota hai
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 5
});

const ADMIN_PASS = process.env.ADMIN_PASS || 'reachcraft123';

// Auto-Create Tables & Seed Initial Data on First Request
let isInitialized = false;
function initCloudDB(callback) {
    if (isInitialized) return callback();

    const tables = [
        `CREATE TABLE IF NOT EXISTS contact_inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(120) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            email VARCHAR(150) NOT NULL,
            service VARCHAR(100) NOT NULL,
            budget VARCHAR(80) DEFAULT 'Not Specified',
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS client_reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            reviewer_name VARCHAR(100) NOT NULL,
            service_used VARCHAR(100) NOT NULL,
            rating INT NOT NULL DEFAULT 5,
            review_text TEXT NOT NULL,
            avatar_color VARCHAR(20) DEFAULT 'blue',
            status VARCHAR(20) DEFAULT 'approved',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS blog_posts (
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
        )`,
        `CREATE TABLE IF NOT EXISTS portfolio_projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            category VARCHAR(60) NOT NULL,
            category_label VARCHAR(80) NOT NULL,
            image_url TEXT NOT NULL,
            description TEXT NOT NULL,
            tags VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS site_settings (
            setting_key VARCHAR(80) PRIMARY KEY,
            setting_value TEXT NOT NULL
        )`
    ];

    let completed = 0;
    tables.forEach(sql => {
        db.query(sql, () => {
            completed++;
            if (completed === tables.length) {
                isInitialized = true;
                seedCloudDefaults();
                callback();
            }
        });
    });
}

function seedCloudDefaults() {
    db.query(`SELECT COUNT(*) AS cnt FROM client_reviews`, (err, rows) => {
        if (!err && rows && rows[0].cnt === 0) {
            db.query(`INSERT INTO client_reviews (reviewer_name, service_used, rating, review_text, avatar_color, status) VALUES
                ('Hamza Tariq', 'Web Development', 5, 'Working with ReachCraft has been an outstanding experience. They designed our business website with exceptional quality, fast speed, and modern design!', 'navy', 'approved'),
                ('Usman Sheikh', 'Meta Ads & Social Media', 5, 'Extremely easy to work with! They took over our Meta Ads and social media management and helped us get consistent customer inquiries on WhatsApp.', 'blue', 'approved'),
                ('Bilal Ahmed', 'Custom Software & Branding', 5, 'ReachCraft built a custom billing and management solution for our setup along with our brand logo. Highly responsive and delivered right on time!', 'teal', 'approved')`);
        }
    });

    db.query(`SELECT COUNT(*) AS cnt FROM blog_posts`, (err, rows) => {
        if (!err && rows && rows[0].cnt === 0) {
            db.query(`INSERT INTO blog_posts (title, category, category_label, author, read_time, image_url, excerpt, content) VALUES
                ('5 Must-Have Features Every Pakistani Business Website Needs to Generate Leads', 'web-software', 'Web Development', 'Asad Khalid', '3 min read', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', 'From under-2-second mobile load speed to one-click WhatsApp chat integration—discover what separates a brochure site from a sales machine.', '<p>A modern business website should load in under 2 seconds on mobile and guide visitors directly to your WhatsApp and inquiry funnel.</p>'),
                ('How to Get High-Intent WhatsApp Leads Using Meta Ads on a Small Budget', 'marketing', 'Meta Ads', 'Furqan', '4 min read', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80', 'Learn how proper audience targeting, creative hooks, and WhatsApp funnel filtering help you attract real buyers.', '<p>You do not need a massive budget to get daily leads on WhatsApp. Proper Meta Ads Manager targeting and creative testing brings qualified buyers.</p>'),
                ('How AI Video Ads & Dynamic Reels Are Cutting Ad Costs by 50%', 'ai-creative', 'AI Video & Editing', 'Zohaib', '3 min read', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'Static posters are being ignored. See how AI-generated product commercials and fast-paced Reels grab attention.', '<p>We combine realistic AI product visuals and voiceovers with fast-paced Premiere Pro/After Effects editing to stop the scroll in the first 3 seconds.</p>')`);
        }
    });

    db.query(`SELECT COUNT(*) AS cnt FROM portfolio_projects`, (err, rows) => {
        if (!err && rows && rows[0].cnt === 0) {
            db.query(`INSERT INTO portfolio_projects (title, category, category_label, image_url, description, tags) VALUES
                ('Restaurant Website & Online Ordering', 'web-software', 'Web Development', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', 'Modern responsive website with digital menu, table reservation, and direct WhatsApp order integration.', 'HTML/CSS/JS, WhatsApp Orders, Mobile First'),
                ('Real Estate Property Portal & Lead Funnel', 'web-software', 'Web Portal + Meta Ads', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80', 'Property listing platform with advanced search filters paired with targeted Meta Lead Ads.', 'Custom Portal, Lead Capture, Meta Pixel'),
                ('Business Inventory, POS & Billing System', 'web-software', 'Custom Software', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80', 'Custom web-based management software built with Node.js & SQL to track daily sales and invoices.', 'Node.js, MySQL, Admin Dashboard')`);
        }
    });
}

// Middleware to ensure tables exist before handling API calls
app.use((req, res, next) => {
    initCloudDB(next);
});

// ================= ADMIN LOGIN =================
app.post('/api/admin/login', (req, res) => {
    if (req.body.password === ADMIN_PASS) {
        res.json({ success: true, token: 'rc_admin_verified_token' });
    } else {
        res.status(401).json({ success: false, error: 'Incorrect Admin Password!' });
    }
});

// ================= 1. REVIEWS API =================
app.get('/api/reviews', (req, res) => {
    const isAdmin = req.query.all === 'true';
    const whereClause = isAdmin ? '' : `WHERE status = 'approved'`;
    const sql = `SELECT id, reviewer_name AS name, service_used AS service, rating, review_text AS text, avatar_color AS color, status, DATE_FORMAT(created_at, '%b %d, %Y') AS time FROM client_reviews ${whereClause} ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, reviews: results });
    });
});

app.post('/api/reviews', (req, res) => {
    const { name, service, rating, text, color, isAdmin } = req.body;
    const status = isAdmin ? 'approved' : 'pending';
    const sql = `INSERT INTO client_reviews (reviewer_name, service_used, rating, review_text, avatar_color, status) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, service, rating || 5, text, color || 'blue', status], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.status(201).json({ success: true, id: result.insertId, status });
    });
});

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

// ================= 2. BLOGS API =================
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
        if (err) return res.status(500).json({ success: false });
        res.status(201).json({ success: true, id: result.insertId });
    });
});

app.delete('/api/blogs/:id', (req, res) => {
    db.query(`DELETE FROM blog_posts WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// ================= 3. PROJECTS API =================
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

// ================= 4. INQUIRIES API =================
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

// ================= 5. SITE SETTINGS API =================
app.get('/api/settings', (req, res) => {
    db.query(`SELECT * FROM site_settings`, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        const settings = {};
        results.forEach(row => { settings[row.setting_key] = row.setting_value; });
        res.json({ success: true, settings });
    });
});

app.post('/api/settings', (req, res) => {
    Object.entries(req.body).forEach(([key, val]) => {
        db.query(`INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`, [key, val, val]);
    });
    res.json({ success: true });
});

module.exports = app;