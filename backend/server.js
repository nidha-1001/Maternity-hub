const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/auth');
const centerRoutes = require('./routes/centers');

app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);

// Basic API route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to Maternity Hub API' });
});

// We will attach other routes here later

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
