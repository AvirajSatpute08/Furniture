// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     product_type_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductType' },

//     product_name: { type: String, required: true },
//     product_price: { type: Number, required: true },
//     duplicate_price: { type: Number },
//     product_size: { type: String },
//     product_color: { type: String },
//     product_label: { type: String },
//     product_details: { type: String },
//     product_image: [{ type: String }]
// });

// const newProduct = mongoose.model('Product1', productSchema);


// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     product_type_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductType' }, // Ensure ObjectId is used
//     product_name: { type: String, required: true },
//     product_price: { type: Number, required: true },
//     duplicate_price: { type: Number },
//     product_size: { type: String },
//     product_color: { type: String },
//     product_label: { type: String },
//     product_details: { type: String },
//     product_image: [{ type: String }]
// });

// // Model name 'Product' is better suited than 'Product1'
// const Product = mongoose.model('Product1', productSchema);


const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
    product_type: {
        type: mongoose.Schema.Types.ObjectId, // Reference to ProductType model
        ref: 'ProductType',
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
    product_label: {
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

// Middleware to update `updated_at` field before saving
productSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Product1 = mongoose.model('Product1', productSchema);
module.exports = Product1;

