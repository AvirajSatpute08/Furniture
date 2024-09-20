const mongoose = require('mongoose');

// Define the schema for the 'Why Choose Us' section
const whyChooseUsSchema = new mongoose.Schema({
    wcu_heading: { type: String, required: true }, // Renamed field
    wcu_details: { type: String, required: true }, // Renamed field
   // wcup_image: { type: String } // Optional field for an image URL
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model based on the schema
const WhyChooseUs = mongoose.model('WhyChooseUs', whyChooseUsSchema);

// Export the model
module.exports = WhyChooseUs;
