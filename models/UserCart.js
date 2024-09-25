const mongoose = require('mongoose');

const userCartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Refers to the user
        ref: 'User',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId, // Refers to the product
        ref: 'ProductType',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    added_at: {
        type: Date,
        default: Date.now
    }
});

const UserCart = mongoose.model('UserCart', userCartSchema);
module.exports = UserCart;
