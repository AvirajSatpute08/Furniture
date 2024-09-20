const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blog_title: { type: String, required: true },
    blog_date: { type: Date, required: true },
    blog_time: { type: String, required: true },
    blogPostBy: { type: String, required: true },
    blogPostByPosition: { type: String, required: true },
    blog_image: { type: String }, // Filename of the uploaded image
    blog_details: { type: String, required: true }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
