const mongoose = require('mongoose');

// Define the schema for a user's cart
const UserCartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user model
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product1', // Reference to the product model
        required: true
    },
    qty: {
        type: Number,
        required: true,
        default: 1
    },
    added_at: {
        type: Date,
        default: Date.now
    }
});

// Export the UserCart model
module.exports = mongoose.model('UserCart', UserCartSchema);
