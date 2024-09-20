const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product_qty: {
        type: Number,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_name: String,
    product_details: String
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderProduct', orderProductSchema);
