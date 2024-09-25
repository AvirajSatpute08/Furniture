// const mongoose = require('mongoose');

// const newsletterSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     }
// }, { timestamps: true });

// const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// module.exports = Newsletter;


const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subscribedAt: { type: Date, default: Date.now } // Optional: to track subscription time
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
