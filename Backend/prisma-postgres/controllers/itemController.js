const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ GET all items
exports.getAll = async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            include: {
                user: true,
                images: true,
                swapRequests: true,
                swaps: true
            }
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items', detail: err.message });
    }
};

// ✅ GET single item by ID
exports.getOne = async (req, res) => {
    try {
        const item = await prisma.item.findUnique({
            where: { id: req.params.id },
            include: {
                user: true,
                images: true,
                swapRequests: true,
                swaps: true
            }
        });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch item', detail: err.message });
    }
};

// ✅ CREATE item
exports.create = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            type,
            size,
            condition,
            tags,
            status,
            userId
        } = req.body;

        const item = await prisma.item.create({
            data: {
                title,
                description,
                category,
                type,
                size,
                condition,
                tags,
                status,
                userId
            }
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: 'Item creation failed', detail: err.message });
    }
};

// ✅ UPDATE item
exports.update = async (req, res) => {
    try {
        const item = await prisma.item.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: 'Update failed', detail: err.message });
    }
};

// ✅ DELETE item
exports.remove = async (req, res) => {
    try {
        await prisma.item.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed', detail: err.message });
    }   
};
