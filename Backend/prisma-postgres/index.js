const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/swap-requests', require('./routes/swapRequestRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));

app.get('/', (req, res) => res.send('ReWear API running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
