// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema definition
const userSchema = new mongoose.Schema({
    c_name: {
        type: String,
        required: true,
    },
    c_email: {
        type: String,
        required: true,
        unique: true,
    },
    c_mobile: {
        type: String,
        required: true,
        unique: true,
    },
    c_password: {
        type: String,
        required: true,
    },
});

// Pre-save hook to hash the password before saving a user
userSchema.pre('save', async function (next) {
    if (!this.isModified('c_password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.c_password = await bcrypt.hash(this.c_password, salt);
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.c_password);
};

module.exports = mongoose.model('User', userSchema);
