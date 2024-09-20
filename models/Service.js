const mongoose = require('mongoose');

// Define the schema for a service
const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,  // URL to the image related to the service
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

// Export the model to use it in other parts of the application
module.exports = mongoose.model('Service', ServiceSchema);
