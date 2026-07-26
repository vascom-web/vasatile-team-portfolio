const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model('Image', ImageSchema);