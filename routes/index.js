const express = require("express");
const router = express.Router();
const { createConversation, viewAllConversations, getSingleConversation, getMessagesInConversation, sendMessage, updateMessage, deleteMessage, markMessageAsSeen, getAllUsers } = require('../controller/conversationController');
const { validateMessage, validateUpdatedMessage } = require('../controller/formValidation')


// POST - Create conversation  and its controller - Check if conversation exists, if it does, redirect, if not create one
router.post('/conversations', createConversation)

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


// Return all users - contains a create conversation button
router.get('/conversations/users', getAllUsers)

module.exports = router;