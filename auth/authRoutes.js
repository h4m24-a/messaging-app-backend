const express = require('express');
const { validateUserSignUp, validateUserLogIn } = require('../auth/authFormValidation');
const handleValidationErrors = require('../middleware/handleValidationErrors');
const { signUpPost, logInUserPost } = require('../auth/authController');
const logoutController = require('./logoutController')
const refreshTokenController = require('./refreshTokenController')

const router = express.Router();


// Sign Up
router.post("/sign-up", validateUserSignUp, handleValidationErrors, signUpPost)

// Login
router.post("/log-in", validateUserLogIn, handleValidationErrors, logInUserPost)


// Logout
router.post("/logout", logoutController)

// Refresh Token  
router.get("/refresh", refreshTokenController)                                                                    // Obtain new access token when they expire using refresh token


module.exports = router;