const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();


// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
    }
});

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
// });
// Create multer instance with storage configuration
const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      res.send('File uploaded successfully');
    } else {
      res.status(400).send('Error uploading file');
    }
  });

module.exports = upload;
