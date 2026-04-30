const express = require('express');
const router = express.Router()
const { getUser, getUserProfile, createProfile, updateProfile } = require('../controller/userController')
const handleValidationErrors = require('../middleware/handleValidationErrors')
const { validateProfile } = require('../controller/formValidation')

// GET /user
router.get('/', getUser);    // Get data about user: id, username


// GET /profile     - View User profile
router.get('/profile', getUserProfile)


// POST /profile - Create profile
router.post('/profile', validateProfile, handleValidationErrors, createProfile)


// PATCH/profile -  Update profile
router.patch('/profile', validateProfile, handleValidationErrors, updateProfile)

module.exports = router;




// every route inside userRouter is prefixed with /user