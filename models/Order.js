// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   c_fname: String,
//   c_lname: String,
//   c_phone: String,
//   c_address: String,
//   total_amt: Number,
//   status: {
//     type: String,
//     default: 'pending'
//   },
//   // Add other fields as needed
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    country: String,
    c_fname: String,
    c_lname: String,
    c_address: String,
    c_area: String,
    c_state: String,
    c_postal_zip: String,
    c_email: String,
    c_phone: String,
    payment_mode: {
        type: String,
        enum: ['online', 'cod'], // Adjust based on your payment modes
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    order_status: {
        type: String,
        enum: ['pending', 'payment_pending', 'completed', 'cancelled'], // Adjust statuses as needed
        default: 'pending'
    },
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        product_qty: Number,
      }],

    
    payment_status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);


// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     country: String,
//     c_fname: String,
//     c_lname: String,
//     c_address: String,
//     c_area: String,
//     c_state: String,
//     c_postal_zip: String,
//     c_email: String,
//     c_phone: String,
//     payment_mode: String,
//     order_date: Date,
//     order_status: String,
//     payment_status: String,
//     items: [{
//         product_id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product',
//             required: true
//         },
//         product_name: String,
//         product_details: String,
//         product_price: Number,
//         product_qty: Number
//     }]
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);
