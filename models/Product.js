const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    product_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType', // Reference to ProductType model
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    duplicate_price: {
        type: Number
    },
    product_size: {
        type: String
    },
    product_color: {
        type: String
    },
    product_details: {
        type: String
    },
    product_image: {
        type: [String], // Array of image filenames
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update 'updated_at' field
productSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
