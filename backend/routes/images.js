const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Public: get all images
router.get('/', imageController.getAll);

// Admin: update image URL
router.put('/:id', auth, adminAuth, imageController.update);

// Admin: upload an image file
router.post('/upload', auth, adminAuth, upload.single('image'), imageController.upload);

// 👇 Admin: delete an image by custom id (e.g., "hero")
router.delete('/:id', auth, adminAuth, imageController.delete);

module.exports = router;