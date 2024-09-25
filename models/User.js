const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    c_id: {
        type: String,
        required: true,
    },
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

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('c_password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.c_password = await bcrypt.hash(this.c_password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.c_password);
};

module.exports = mongoose.model('User', userSchema);
