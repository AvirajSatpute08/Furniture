// const mongoose = require('mongoose');

// const ContactSchema = new mongoose.Schema({
//     fname: {
//         type: String,
//         required: true
//     },
//     lname: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Contact', ContactSchema);



const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now } // Optional: to track submission time
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
