const multer = require('multer');
const path = require('path');

// Setup storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Specify the folder to save uploads
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

module.exports = upload;
