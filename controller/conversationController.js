const db = require('../prisma/queries')
const { validationResult } = require("express-validator");



// POST- Create conversation between two users if it doesn't exist
async function createConversation(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userA = req.user.id;
    const userB = parseInt(req.body.userBId);

    const conversation = await db.getOrCreateConversation(userA, userB)

    res.json({
      conversation
    })
    
  } catch (error) {
    console.error('Error fetching or creating conversations', error);
    res.status(500).json({ error: "Error fetching or creating conversations" });
  }
}

// GET - View all conversations for authenticated user
async function viewAllConversations(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id;

    const conversations = await db.getAllConversations(userId);

    if (!conversations || conversations.length === 0) {
      return res.json({ conversations: [], message: 'No conversations found' });
    }

    res.json({
      conversations,
      message: 'Successfully fetched all conversations'
    });

  } catch (error) {
    console.error('Error fetching all conversations', error);
    res.status(500).json({ error: "Error fetching conversations" });
  }
}


// GET- a single conversation (metadata)
async function getSingleConversation(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id;

    const conversationId = parseInt(req.params.conversationId) 

    const conversation =  await db.getSingleConversation(conversationId, id)

     if (!conversation) {
      return res.json({ message: 'No conversation found, DB' });
    }


    res.json({
      conversation,
      message: 'Succesfully fetched conversation',
    })


    
  } catch (error) {
    console.error('Error fetching all conversations', error);
    res.status(500).json({ error: "Error fetching conversations" });
  }
  
}

// GET- View a single conversation and messages  
async function getMessagesInConversation(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id;

    const conversationId = parseInt(req.params.conversationId) 

    const messages = await db.getMessagesInConversation(conversationId, userId)

    if (!messages) {
      return res.json({ message: 'No messages found, DB' });
    }

    res.json({
      messages,
      message: 'Successfully fetched messages'
    })
    
  } catch (error) {
    console.error('Error fetching messages', error);
    res.status(500).json({ error: "Error fetching messages" });
    
  }
}


// POST - Send Message-  /conversations/:conversationId/messages
async function sendMessage(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id;
    const conversationId = parseInt(req.params.conversationId);
    const { text } = req.body

    const message = await db.createMessage(text, conversationId, userId)

    if (!message) {
      return res.json({ message: 'Error sending message - DB' });
    }

    res.json({
      message,
      message: 'Successfully sent message'
    })
    
  } catch (error) {
    console.error('Error sending message', error);
    res.status(500).json({ error: "Error sending message" });
  }
}



// PUT- Update message - conversations/:conversationId/messages/:messageId
async function updateMessage(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id;
    const conversationId = parseInt(req.params.conversationId, 10);
    const messageId = parseInt(req.params.messageId, 10);
    const { updatedText } = req.body;

    const messageDB = await db.getSingleMessage(messageId, userId)

    if (!messageDB) {
      res.status(404).json({ error: 'Message not found' })
    }

    if (messageDB.conversationId !== conversationId) {                  // 1 !== 1 would return false,   1 !== 2 would return true, subsequent code will run
      return res.status(400).json({ error: 'Message does not belong to this conversation' })
    }

    const updatedMessage = await db.updateMessage(updatedText, userId, messageId);

    res.json({
      message: 'Successfully updated message',
      updatedMessage
    })

  } catch (error) {
    console.error('Error updating message', error);
    res.status(500).json({ error: "Error updating message" });
    
  }
}


// DELETE- Delete message - conversations/:conversationId/messages/:messageId
async function deleteMessage(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id;
    const conversationId = parseInt(req.params.conversationId, 10);
    const messageId = parseInt(req.params.messageId, 10);

    const messageDB = await db.getSingleMessage(messageId, userId)

    if (!messageDB) {
      res.status(404).json({ error: 'Message not found' })
    }

    if (messageDB.conversationId !== conversationId) {                  // 1 !== 1 would return false,   1 !== 2 would return true, subsequent code will run
     return res.status(400).json({ error: 'Message does not belong to this conversation' })
    };

    const id = messageDB.id     // retrieve message id

    await db.deleteMessage(id, userId);

    res.status(204).json({ message: 'Succesfully deleted message'})
    
  } catch (error) {
    console.error('Error deleting message', error);
    res.status(500).json({ error: "Error deleting message" });
  }
  
}


// PATCH  - Mark messages as seen - /conversations/:conversationId/seen
async function markMessageAsSeen(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id
    const conversationId = parseInt(req.params.conversationId, 10);

    // const messageId = parseInt(req.params.messageId, 10);


      // Get messageId using singleMessage query
    // const messageDB = await db.getSingleMessage(messageId)

    // if (!messageDB) {
    //   return res.status(404).json({ error: 'Message not found' })
    // }


    // Mark message as seen - set to true
    const updatedSeenStatus = await db.toggleMarkSeen(conversationId, userId)

    res.json({
      updatedSeenStatus,
      message: 'All unseen messages marked as true'
    })


  } catch (error) {
    console.error('Error updating seen status', error);
    res.status(500).json({ error: "Error updating seen status" });
    
  }

}


// GET - Return all users for messaging
async function getAllUsers(req, res) {
  try {
    
    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const userId = req.user.id

    const users = await db.getAllUsers(userId)

    
    if (!users || users.length === 0) {
      return res.status(200).json({
        users: [],
        message: "No users found",
      });
    }

    // Success
    res.json({
      users,
      message: 'Successfully returned users'
    })
    
  } catch (error) {
    console.error('Error returning users', error);
    res.status(500).json({ error: "Error returning users" });
  }
}

module.exports = {
  createConversation,
  viewAllConversations,
  getSingleConversation,
  getMessagesInConversation,
  sendMessage,
  updateMessage,
  deleteMessage,
  markMessageAsSeen,
  getAllUsers
}