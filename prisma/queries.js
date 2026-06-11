const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Prisma adapter
const adapter = new PrismaPg(pool);

// Prisma client WITH adapter
const prisma = new PrismaClient({
  adapter,
});

//! Conversation & Messages
// View all conversations and one message -  for home page
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
        user1: {
          select: {
            id: true,
            username: true,
            profile_image: true
          }

        },
        user2: {
          select: {
            id: true,
            profile_image: true,
            username: true
          }

        },
        messages: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,                     // displays the latest message
          select: {
            text: true,
            created_at: true,
            seen: true,                // boolean value depending on value
            sender: {
              select: {
                username: true
              },
            },
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
async function getSingleConversation(id, userId) {
  try {
    const conversation = await prisma.conversation.findUnique({
        where: {
        id: Number(id),
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
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
        user1: {
          select: {
            id: true,
            username: true,
            profile_image: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            profile_image: true
          },
        }
      }
    })
    return conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
    
  }
}



// View all messages in a conversation for a user
async function getMessagesInConversation(id, userId) {
  try {
    const conversation = await prisma.conversation.findFirst({
      
      where: {
        id: id,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        messages: {
          orderBy: {
            created_at: "asc"
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                profile_image: true
              }
            }
          }
        },
        user1: {
          select: {
            id: true,
            username: true,
            profile_image: true
          }
        },
        user2: {
          select: {
            id: true,
            username: true,
            profile_image: true
          },
        }
      }
    });

    return conversation; 
  } catch (error) {
    console.error("Prisma Error fetching messages:", error);
    throw error;
  }
}


// Check if convo exists, if not create a conversation
async function getOrCreateConversation(userA, userB) {
  try {
    // Normalize order. User1 will be the smallest, user2 would be the biggest
    const user1Id = Math.min(userA, userB);
    const user2Id = Math.max(userA, userB);


    
    // First check if it already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        user1Id,
        user2Id,
      },
    });

    if (existingConversation) {
      return existingConversation
    }
    


    // If not, create it
      const conversation = await prisma.conversation.create({
        data: {
          user1Id,
          user2Id,
        },
      });

    return conversation;
  } catch (error) {
    console.error("Error creating conversation", error);
    throw error;
  }
}



// Get a specific conversation using conversationId and userId
async function getConversationByIdForUser(conversationId, userId) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });

    return conversation;
  } catch (error) {
    console.error("Error fetching conversation", error);
    throw error;
  }
}



// Get A Single message
async function getSingleMessage(messageId, userId) {
  try {
    const message = await prisma.messages.findFirst({
      where: {
      id: messageId,
      conversation: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    }
  })

    return message;
    
  } catch (error) {
    console.error('Error fetching message', error);
    throw error
  }
  
}




// Send a message
async function createMessage(message, conversationId, userId) {
  try {
    const newMessage = await prisma.messages.create({
      data: {
        text: message,
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
async function updateMessage(updatedMessage, userId, messageId) {
  try {
    const updatedMessage =  await prisma.messages.updateMany({
      where: {
        id: messageId,
        senderId: userId
      },
      data: {
        text: updatedMessage
      }
    })

    return updatedMessage
  } catch (error) {
    console.error('Error updating message', error);
    throw error
  }

}



// Delete a message
async function deleteMessage(messageId, userId) {
  try {
    await prisma.messages.deleteMany({
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



// Toggle - Mark message as read
async function toggleMarkSeen(conversationId, userId) {
  try {
    const seenMessageStatus = await prisma.messages.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },  // only messages sent by the other person
        seen: false
      },
      data: {
        seen: true  // set to true 
      }
    })

    return seenMessageStatus
    
  } catch (error) {
    console.error('Error marking message as seen - DB', error);
    throw error
  }
}



// Return all users for selecting who to message excluding logged in user
async function getAllUsers(userId) {
  try {
    const users = await prisma.users.findMany({
      where: {
        id: {
          not: userId
        }
      },
      select: {
        id: true,
        username: true,
        profile_image: true,
        created_at: true
      }
    })

    return users;
    
  } catch (error) {
    console.error('Error fetching all users', error);
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
    });

    return profile
  } catch (error) {
    console.error('Error fetching user profile', error);
    throw error
  }
}


// create profile - add profile image & bio
async function createProfile(userId, profileImage, bio) {
  try {
    const profile = await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        profile_image: profileImage,
        bio: bio
      }
    });

    return profile;

  } catch (error) {
    console.error('Error creating user profile', error);
    throw error;
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
    console.error('Error creating user', error);
    throw error
  }
  
}


// Get user by username
async function findUserByUsername(username) {
  try {
   const user = await prisma.users.findUnique({
      where: {
        username
      },
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
  getOrCreateConversation,
  getConversationByIdForUser,

  getSingleMessage,
  createMessage,
  updateMessage,
  deleteMessage,
  toggleMarkSeen,
  getProfileOfUser,
  createProfile,
  updateProfile,

  getAllUsers,

  insertUser,
  findUserByUsername,
  selectUserById,
  storeRefreshToken,
  getRefreshTokenByUserId,
  deleteRefreshToken
}