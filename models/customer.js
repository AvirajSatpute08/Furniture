// const mongoose = require('mongoose');

// const customerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   mobile: String,
//   password: String,
// });

// const Customer = mongoose.model('Customer', customerSchema);
// module.exports = Customer;


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // For password hashing

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from the start and end
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that emails are unique in the collection
    trim: true,
    lowercase: true, // Stores emails in lowercase
  },
  mobile: {
    type: String,
    required: true,
    unique: true, // Ensures that mobile numbers are unique in the collection
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Hash the password before saving the user
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare input password with hashed password
customerSchema.methods.validPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
