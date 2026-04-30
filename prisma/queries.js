import { PrismaClient } from '@prisma/client';  // This imports the PrismaClient class from the @prisma/client package.

const prisma = new PrismaClient();    // creates an instance of PrismaClient, The prisma object acts as your connection to the database and provides methods to interact with different tables



//! Conversation & Messages
// View all converations and one message -  for home page
async function getAllConversations(userId) {
  try {
    const conversations =  await prisma.conversation.findMany( {
      where: {
        OR : [                                    // Get converstations even if one user hasn't sent a message
          { user1Id : userId},
          { user2Id : userId}
        ]
      },
      include: {
        messages: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,                     // displays the latest message
          select: {
            text: true,
            sender: true,
            created_at: true,
            seen: true                // boolean value depending on value
          },
        }
      }
    })

    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  } 
}




// View a single conversation 
async function getSingleConversation(conversationId) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        messages: {
          orderBy:{
            created_at: 'desc'
          },
          include: {
            sender: true
          }
        },
        user1: true,
        user2: true,
      }
    })
    return conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
    
  }
}




async function getMessagesInConversation(conversationId, userId) {
  try {
    const messages = await prisma.messages.findMany({
      where: {
        conversationId: conversationId,
        conversation: {                   // conversation - enforce that the requesting user belongs to that conversation
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ]
        }
      },
      orderBy: {
        created_at: "asc"
      },
      include: {
        sender: true
      }
    });

    return messages;
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
}



// Get A Single message
async function getSingleMessage(messageId, userId) {
  try {
    const message = await prisma.messages.findFirst({
      where: {
        id: messageId,
        senderId: userId
      }
    })
    
  } catch (error) {
    console.error('Error fetching message', error);
    throw error
  }
  
}




// Send a message
async function createMessage(text, conversationId, userId) {
  try {
    const newMessage = await prisma.messages.create({
      data: {
        text: text,
        senderId: userId,
        conversationId: conversationId

      }
    });
    return newMessage;
    
  } catch (error) {
    console.error('Error sending message', error);
    throw error
  }
  
}



// Update a message
async function updateMessage(updatedText, userId, messageId) {
  try {
    const updatedMessage =  await prisma.messages.update({
      where: {
        id: messageId,
        senderId: userId
      },
      data: {
        text: updatedText
      }
    })
  } catch (error) {
    console.error('Error updating message', error);
    throw error
  }

}



// Delete a message
async function deleteMessage(messageId, userId) {
  try {
    await prisma.messages.delete({
      where: {
        id: messageId,
        senderId: userId
      }
    })
  } catch (error) {
    console.error('Error deleting message', error);
    throw error
  }
}




//! Profile


// Get user profile - username, profile image, bio
async function getProfileOfUser(userId) {
  try {
    const profile = await prisma.users.findUnique({
      where: {
        id: userId
      },
      select: {
        username: true,
        profile_image: true,
        bio: true
      }
    })
  } catch (error) {
    console.error('Error fetching user profile', error);
    throw error
  }
}


// create profile - add profile image & bio
async function createProfile(userId, profileImage, bio) {
  try {
    const profile = await prisma.users.create({
      data: {
        id: userId,
        profile_image: profileImage,      // use .optional for both input forms
        bio: bio
      }
    })
    
  } catch (error) {
    console.error('Error creating user profile', error);
    throw error
  } 
}


// Update profile - add profile image & bio
async function updateProfile(userId, updatedProfileImage, updatedBio) {
  try {
    const profile = await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        profile_image: updatedProfileImage,      // use .optional for both input forms
        bio: updatedBio
      }
    })
    return profile
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error
  } 
}






//! Auth

// Insert username & password to database

async function insertUser(username, password) {
  try {
    return await prisma.users.create({
      data: {
        username: username,     // 2nd username represents the username from form, this is dynamic
        password: password
      }
    })
  } catch (error) {
    console.eroror('Error creating user', error);
    throw error
  }
  
}


// Get user by username
async function findUserByUsername(username) {
  try {
   const user = await prisma.users.findUnique({
      where: {
        username
      }
    });
    return user
  } catch (error) {
    console.error('Error finding user', error);
    throw error
  }
}



// Get user by ID
async function selectUserById(id) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id
      }
    })
    return user
  } catch (error) {
    console.error('Error finding user', error);
    throw error;
    
  }
}


//! JWT

// Store refresh token of user
async function storeRefreshToken(userId, refreshToken) {
  try {
    await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        refreshToken
      }
    })

  } catch (error) {
    console.error('Error storing refresh token', error)
    throw error
  }
}



// Get refresh token by user id
async function getRefreshTokenByUserId(userId) {
  try {
    const user = await prisma.users.findUnique({
      select: {
        refreshToken: true                        // return refresh token
      },
      where: {                                       // Using id of user
        id: userId
      }
    })
    return user?.refreshToken         // Return user.refreshtoken if user is not null or undefined.
  } catch (error) {
    console.error('Failed to retrieve refresh token of user', error)
    throw error
  }

}


// Delete refresh token from user
async function deleteRefreshToken(userId) {
  try {
    await prisma.users.update({
      data:{
        refreshToken: null
      },
      where: {
        id: userId
      }
    })
    
  } catch (error) {
    console.error('Failed to delete refresh token', error)
    throw error
  }
}




module.exports = {
  getAllConversations,
  getSingleConversation,
  getMessagesInConversation,
  getSingleMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  getProfileOfUser,
  updateProfile,

  insertUser,
  findUserByUsername,
  selectUserById,
  storeRefreshToken,
  getRefreshTokenByUserId,
  deleteRefreshToken
}