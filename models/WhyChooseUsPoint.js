const mongoose = require('mongoose');

// Define the schema for the 'Why Choose Us Point' section
const whyChooseUsPointSchema = new mongoose.Schema({
    heading: { type: String, required: true }, // Required field for the heading
    description: { type: String, required: true }, // Required field for the description
    wcup_image: { type: String } // Optional field for the image URL
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model based on the schema
const WhyChooseUsPoint = mongoose.model('WhyChooseUsPoint', whyChooseUsPointSchema);

// Export the model
module.exports = WhyChooseUsPoint;
