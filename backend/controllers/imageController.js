const Image = require('../models/Image');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------- GET all images (public) ----------
exports.getAll = async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    console.error('Get images error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ---------- UPDATE image URL by custom id (admin) ----------
exports.update = async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  try {
    const image = await Image.findOneAndUpdate(
      { id },
      { url },
      { new: true, upsert: true }
    );
    res.json(image);
  } catch (err) {
    console.error('Update image error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ---------- UPLOAD a new image file (admin) ----------
exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'vasatile-portfolio',
      public_id: `hero_${Date.now()}`,
    });

    // Delete temporary file
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    // Update hero image
    const image = await Image.findOneAndUpdate(
      { id: 'hero' },
      { url: result.secure_url },
      { new: true, upsert: true }
    );

    res.json({ url: result.secure_url, image });
  } catch (err) {
    console.error('Upload error:', err.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Upload failed' });
  }
};
// ---------- Delete an image by custom id (admin) ----------
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Image.findOneAndDelete({ id });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Delete image error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};