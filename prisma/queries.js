const { PrismaClient } = require('@prisma/client')   // This imports the PrismaClient class from the @prisma/client package.

const prisma = new PrismaClient();    // creates an instance of PrismaClient, The prisma object acts as your connection to the database and provides methods to interact with different tables







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
  insertUser,
  findUserByUsername,
  selectUserById,
  storeRefreshToken,
  getRefreshTokenByUserId,
  deleteRefreshToken
}