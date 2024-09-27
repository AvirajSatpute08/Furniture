// const mongoose = require('mongoose');

// const userCartSchema = new mongoose.Schema({
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId, // Refers to the user
//         ref: 'User',
//         required: true
//     },
//     product_id: {
//         type: mongoose.Schema.Types.ObjectId, // Refers to the product
//         ref: 'Product',
//         required: true
//     },
//     quantity: {
//         type: Number,
//         default: 1
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
//     added_at: {
//         type: Date,
//         default: Date.now
//     }
// });

// const UserCart = mongoose.model('UserCart', userCartSchema);
// module.exports = UserCart;



const mongoose = require('mongoose');

const userCartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // Refers to the user
        ref: 'User',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId, // Refers to the product
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    new_qty: {
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
