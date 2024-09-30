const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    
   product_type_id: { type: String ,
                     required: [true, 'Path `product_type_id` is required.']
   },
    product_type_name: { type: String, required: true }
});

module.exports = mongoose.model('ProductType', productTypeSchema);
