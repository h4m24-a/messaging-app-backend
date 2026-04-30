const { body } = require('express-validator');  // form validation

const validateProfile= [
  body('bio')
  .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Bio must be between 3 and 100 characters long.')
    .escape(), // Sanitization: Escape special characters,
    
    
    body('profileImage')
    .optional({ checkFalsy: true })
];




module.exports = { validateProfile  };