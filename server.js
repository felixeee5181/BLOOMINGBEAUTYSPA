// ============================================================
// 01. IMPORTS
// ============================================================
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// ============================================================
// 02. APP SETUP
// ============================================================
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));  // serves index.html, admin.html, style.css from root
app.use('/uploads', express.static('uploads'));

// ============================================================
// 03. MONGO DB CONNECTION
// ============================================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// ============================================================
// 04. USER MODEL
// ============================================================
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// ============================================================
// 05. IMAGE MODEL
// ============================================================
const imageSchema = new mongoose.Schema({
    title: String,
    description: String,
    filename: String,
    filepath: String,
    uploadedAt: { type: Date, default: Date.now }
});
const Image = mongoose.model('Image', imageSchema);

// ============================================================
// 06. MULTER UPLOAD CONFIG
// ============================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// ============================================================
// 07. JWT AUTH MIDDLEWARE
// ============================================================
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// ============================================================
// 08. API ROUTES
// ============================================================

// 08a. Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashed });
        await user.save();
        res.json({ success: true });
    } catch {
        res.status(400).json({ error: 'Username already exists' });
    }
});

// 08b. Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);
    res.json({ token, username });
});

// 08c. Upload Image (Admin only)
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const img = new Image({
        title,
        description,
        filename: req.file.filename,
        filepath: req.file.path
    });
    await img.save();
    res.json({ success: true, image: img });
});

// 08d. Get all images (Public)
app.get('/api/images', async (req, res) => {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json(images);
});

// 08e. Delete image (Admin only)
app.delete('/api/images/:id', auth, async (req, res) => {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ error: 'Not found' });
    fs.unlinkSync(img.filepath);
    await img.deleteOne();
    res.json({ success: true });
});

// ============================================================
// 09. SERVER START
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
