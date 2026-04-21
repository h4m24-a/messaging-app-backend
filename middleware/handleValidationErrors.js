const { validationResult } = require('express-validator')

const runValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {          // checks if the validation result is not empty (i.e., there are validation errors). It wants their to be an error
    return res.status(400).json({ errors: errors.array() });  // If yes, it sends a 400 Bad Request response to the client with the error details in JSON format.
  }
  next()  // If no errors, it calls next() to proceed to the next middleware or controller
}

module.exports = runValidation



/*
validationResult
- collects all validation errors found in the middleware for the current request
- if there are any validation errors, it returns an object containing those errors
- if there are no errors, it returns an empty result


eg. When a POST request comes in:

validateComment runs — it validates and sanitizes the comment.

runValidation runs — it checks for errors and either stops with a 400 or continues.

createCommentController runs — now I can safely handle the validated data, e.g., save it to a database.


Prevents invalid or harmful data from reaching controllers
Helps to secure API against XSS
Gives feedback to clients


   errors.isEmpty() returns true if no errors are present.
/  !errors.isEmpty() returns true if validation errors are found.

*/