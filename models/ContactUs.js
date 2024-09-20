const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true }
});

module.exports = mongoose.model('ContactUs', ContactUsSchema);
