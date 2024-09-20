const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  team_name: { type: String, required: true },
  team_position: { type: String, required: true },
  owner_details: { type: String, required: true },
  profile_link: { type: String },
  team_image: { type: String }
});

OwnerSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;