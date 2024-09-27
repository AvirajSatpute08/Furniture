// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     product_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//     },
//     qty: {
//         type: Number,
//         required: true
//     },
//     new_qty: {
//         type: Number,
//         default: 1
//     },
//     product_price: {
//         type: Number,
//         ref: 'Product',
//         required: true
//     },
//     product_name: String,
//     product_details: String
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Cart', cartSchema);





const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
    qty: {
        type: Number,
        required: true
    },
    new_qty: {
        type: Number,
        default: 1
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

module.exports = mongoose.model('Cart', cartSchema);
