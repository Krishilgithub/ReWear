const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');

// Only allow images
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const {
    uploadImage,
    deleteImage,
    getAll
} = require('../controllers/imageController');

router.get('/', getAll);
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/:id', deleteImage);

module.exports = router;
