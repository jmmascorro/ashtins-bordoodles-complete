const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Puppy = require('./models/Puppy');
const Parent = require('./models/Parent');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route (Health Check)
app.get('/', (req, res) => {
    res.send('API is running! 🐶');
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the frontend's public directory (fallback/legacy)
app.use(express.static(path.join(__dirname, '..', 'bordoodles-site', 'public')));

// Multer Setup for Image Uploads

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save to local 'uploads' directory in the API folder
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Unique filename: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes

// --- Upload Route ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Return the web-accessible path (prefixed with /uploads)
        const webPath = `/uploads/${req.file.filename}`;
        res.json({ url: webPath });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// --- Puppies CRUD ---
// 1. Get all
app.get('/api/puppies', async (req, res) => {
    try {
        const puppies = await Puppy.findAll();
        res.json(puppies);
    } catch (error) {
        console.error('Error fetching puppies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. Create
app.post('/api/puppies', async (req, res) => {
    try {
        // Expects json body matching model
        const newPuppy = await Puppy.create(req.body);
        res.status(201).json(newPuppy);
    } catch (error) {
        console.error('Error creating puppy:', error);
        res.status(500).json({ error: 'Failed to create puppy' });
    }
});

// 3. Update
app.put('/api/puppies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Puppy.update(req.body, { where: { id } });
        if (updated) {
            const updatedPuppy = await Puppy.findByPk(id);
            res.json(updatedPuppy);
        } else {
            res.status(404).json({ error: 'Puppy not found' });
        }
    } catch (error) {
        console.error('Error updating puppy:', error);
        res.status(500).json({ error: 'Failed to update puppy' });
    }
});

// 4. Delete
app.delete('/api/puppies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Puppy.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Puppy not found' });
        }
    } catch (error) {
        console.error('Error deleting puppy:', error);
        res.status(500).json({ error: 'Failed to delete puppy' });
    }
});

// --- Parents CRUD ---
// 1. Get all
app.get('/api/parents', async (req, res) => {
    try {
        const parents = await Parent.findAll();
        res.json(parents);
    } catch (error) {
        console.error('Error fetching parents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. Create
app.post('/api/parents', async (req, res) => {
    try {
        const newParent = await Parent.create(req.body);
        res.status(201).json(newParent);
    } catch (error) {
        console.error('Error creating parent:', error);
        res.status(500).json({ error: 'Failed to create parent' });
    }
});

// 3. Update
app.put('/api/parents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Parent.update(req.body, { where: { id } });
        if (updated) {
            const updatedParent = await Parent.findByPk(id);
            res.json(updatedParent);
        } else {
            res.status(404).json({ error: 'Parent not found' });
        }
    } catch (error) {
        console.error('Error updating parent:', error);
        res.status(500).json({ error: 'Failed to update parent' });
    }
});

// 4. Delete
app.delete('/api/parents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Parent.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Parent not found' });
        }
    } catch (error) {
        console.error('Error deleting parent:', error);
        res.status(500).json({ error: 'Failed to delete parent' });
    }
});

// --- Messages ---
app.post('/api/messages', (req, res) => {
    console.log('Received message:', req.body);
    res.json({ success: true, message: 'Message received' });
});

// Initialize Database and Start Server
sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
