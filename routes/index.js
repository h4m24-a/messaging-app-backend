const express = require("express");
const router = express.Router();


// GET- View all conversations for authenticated user
router.get('/conversations', )


// GET- a single conversation (metadata)
router.get('/conversations/:conversationId')


// GET- View one conversation and messages  
router.get('/conversations/:conversationId/messages')


// POST- Send new message
router.post('/conversations/:conversationId/messages')


// PUT- Update message
router.put('/conversations/:conversationId/messages/:messageId');


// DELETE- Delete message
router.delete('/conversations/:conversationId/messages/:messageId');


// Mark messages as read
router.patch('/conversations/:conversationId/read')


module.exports = router;