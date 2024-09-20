const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner_title: String,
    banner_details: String,
    banner_link: String,
    banner_image: String,  // Filename for the uploaded image
});

module.exports = mongoose.model('Banner', bannerSchema);
