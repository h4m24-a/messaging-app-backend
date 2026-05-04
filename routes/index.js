const express = require("express");
const router = express.Router();
const { viewAllConversations, getSingleConversation, getMessagesInConversation, sendMessage, updateMessage, deleteMessage, markMessageAsSeen } = require('../controller/conversationController');
const { validateMessage, validateUpdatedMessage } = require('../controller/formValidation')


// GET- View all conversations for authenticated user
router.get('/conversations', viewAllConversations )


// GET- a single conversation (metadata)
router.get('/conversations/:conversationId', getSingleConversation)


// GET- View one conversation and messages  
router.get('/conversations/:conversationId/messages', getMessagesInConversation)


// POST- Send new message
router.post('/conversations/:conversationId/messages', validateMessage, sendMessage)


// PUT- Update message
router.put('/conversations/:conversationId/messages/:messageId', validateUpdatedMessage, updateMessage);


// DELETE- Delete message
router.delete('/conversations/:conversationId/messages/:messageId', deleteMessage);


// Mark messages as seen
router.patch('/conversations/:conversationId/messages/seen', markMessageAsSeen)


module.exports = router;