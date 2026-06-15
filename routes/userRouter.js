const express = require('express');
const router = express.Router();
const { getUser, getUserProfile, createProfile, updateProfile } = require('../controller/userController')
const handleValidationErrors = require('../middleware/handleValidationErrors')
const { validateProfile, validateUpdatedProfile } = require('../controller/formValidation')
require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require("path");
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');  // Importing the S3 client
const { Upload } = require('@aws-sdk/lib-storage'); // For multipart uploads


// AWS Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  },
});



const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,  
    acl: 'public-read',  //  make the file publicly readable
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // Generate a unique file name for the S3 object
      cb(null, `profile/${Date.now()}_${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);  // Accept the file
    } else {
      cb(new Error('Error: Only images are allowed!'), false);  // Reject the file
    }
  }
});


// GET /user
router.get('/userData', getUser);    // Get data about user: id, username


// GET /profile     - View User profile
router.get('/profile', getUserProfile)


// POST /profile - Create profile
router.post('/profile', validateProfile, upload.single('profileImage'), handleValidationErrors, createProfile)


// PATCH/profile -  Update profile
router.patch('/profile', validateUpdatedProfile, upload.single('updatedProfileImage'), handleValidationErrors, updateProfile)

module.exports = router;




// every route inside userRouter is prefixed with /user