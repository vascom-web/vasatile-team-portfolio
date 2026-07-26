const Image = require('../models/Image');

exports.getAll = async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  try {
    const image = await Image.findOneAndUpdate({ id }, { url }, { new: true, upsert: true });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};