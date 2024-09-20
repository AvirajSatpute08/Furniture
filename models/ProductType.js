const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    product_type_id: { type: String },
    product_type_name: { type: String, required: true }
});

module.exports = mongoose.model('ProductType', productTypeSchema);
