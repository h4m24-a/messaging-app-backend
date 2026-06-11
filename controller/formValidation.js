const { body } = require('express-validator');  // form validation

const validateProfile= [
  body('bio')
  .optional({ checkFalsy: true })   // bio is not required
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Bio must be between 3 and 100 characters long.')
    .escape(), // Sanitization: Escape special characters,
    
    
    body('profileImage')
    .optional({ checkFalsy: true })   // values that are considered falsy in JavaScript are treated as if the field is not provided.
];


const validateUpdatedProfile= [
  body('updatedBio')
  .optional({ checkFalsy: true })   // bio is not required
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Bio must be between 3 and 100 characters long.')
    .escape(), // Sanitization: Escape special characters,
    
    
    body('updatedProfileImage')
    .optional({ checkFalsy: true })   // values that are considered falsy in JavaScript are treated as if the field is not provided.
];


const validateMessage = [
  body('message')
  
  .exists({ checkFalsy: true })
  .withMessage('Message is required')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Message must be between 1 and 100 characters')
  .isString().withMessage('Message must be a string')
  .customSanitizer(value => String(value))
  .escape() // prevents HTML/script injection
]


const validateUpdatedMessage = [
  body('updatedMessage')
  
  .exists({ checkFalsy: true })
  .withMessage('Message is required')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Message must be between 1 and 100 characters')
  .isString().withMessage('Message must be a string')
  .customSanitizer(value => String(value))
  .escape(), // prevents HTML/script injection
]

module.exports = { validateProfile, validateUpdatedProfile, validateMessage, validateUpdatedMessage  };



/*
falsy values include:

"" (empty string)
0
false
null
undefined
NaN
*/