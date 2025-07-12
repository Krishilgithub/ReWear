const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { cloudinary } = require('../utils/cloudinary');

exports.getAll = async (req, res) => {
    try {
        const images = await prisma.itemImage.findMany();
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch images', detail: err.message });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const { itemId } = req.body;

        const image = await prisma.itemImage.create({
            data: {
                imageUrl: req.file.path,      // Cloudinary image URL
                publicId: req.file.filename,  // Cloudinary publicId
                itemId
            }
        });

        res.status(201).json(image);
    } catch (err) {
        res.status(500).json({ error: 'Upload failed', detail: err.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await prisma.itemImage.findUnique({
            where: { id: req.params.id }
        });

        if (!image) return res.status(404).json({ error: 'Image not found' });

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // Delete from database
        await prisma.itemImage.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Image deleted from Cloudinary and database' });
    } catch (err) {
        res.status(500).json({ error: 'Deletion failed', detail: err.message });
    }
};
