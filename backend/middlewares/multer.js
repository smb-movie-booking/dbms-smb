// middlewares/upload.js
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinary");

// Use memory storage (no disk)
const upload = multer({ storage: multer.memoryStorage() });

// Upload file buffer to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();
  

  const stream = cloudinary.uploader.upload_stream(
    
    (error, result) => {
      if (error) return console.log(error);

      // Attach the uploaded image URL to req.body
      req.body.imageUrl = result.secure_url;
      //console.log(result.secure_url);
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = { upload, uploadToCloudinary };
