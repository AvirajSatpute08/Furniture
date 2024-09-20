const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  admin_mobile: {
    type: String,
    required: true,
    unique: true,
  },
  admin_password: {
    type: String,
    required: true,
  },
  admin_name: {
    type: String,
    required: true,
  },
  admin_email: {
    type: String,
    required: true,
    unique: true,
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId for admin id
    auto: true,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
