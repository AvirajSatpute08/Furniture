const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for Testimonial
const testimonialSchema = new Schema({
  c_name: {
    type: String,
    required: true
  },
  c_position: {
    type: String,
    required: true
  },
  c_message: {
    type: String,
    required: true
  },
  c_image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
