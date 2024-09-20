const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for ModernInterior
const modernInteriorSchema = new Schema({
  heading: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  key_point1: {
    type: String,
    required: true
  },
  key_point2: {
    type: String,
    required: true
  },
  key_point3: {
    type: String,
    required: true
  },
  key_point4: {
    type: String,
    required: true
  },
  image1: {
    type: String,
    default: ''
  },
  image2: {
    type: String,
    default: ''
  },
  image3: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const ModernInterior = mongoose.model('ModernInterior', modernInteriorSchema);
module.exports = ModernInterior;
