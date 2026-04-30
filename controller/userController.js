const db = require('../prisma/queries')


// GET - User 
async function getUser(req, res) {
  try {
    const { id, username } = req.user;    // destrucure to retrieve id, username from req.user object
    
    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    res.json({
      message: `${username}'!`,
      username, // Data from jwt payload
      id,
    });

  } catch (error) {
    console.error('Error fetching user', error)
    res.status(500).json({ error: "Error fetching User" });
  }  
}


// GET /profile  - view user profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.id; //  retrieve id  from req.user object

    if (!req.user) {
      return res.status(401).json({ message: 'You are not authorzied' })
    };



    const profile = await db.getUserProfile(userId)

    if (!profile) {
      return res.json({ message: 'Error viewing profile' })
    }

    res.json({
      profile,
      message: 'Fetching profile was successful'
    })
    
  } catch (error) {
    console.error('Error fetching user', error);
    res.status(500).json({ error: "Error fetching User" });
  }
}




// Create profile
async function createProfile(req, res) {
  try {
    
    const userId = req.user.id; //  retrieve id  from req.user object

    if (!req.user) {
      return res.status(401).json({ message: 'You are not authorzied' })
    };

    const { bio, profileImage } = req.body;

    const profile = await db.createProfile(userId, bio, profileImage)


    if (!profile) {
      return res.json({ error: 'Error creating profile' })
    }


    res.json({
      message: 'Successfully created profile',
      profile
    });


    
  } catch (error) {
    console.error('Error creating profile', error)
    res.status(500).json({ error: "Error creating profile" });
  }
}



// Update profile - add profile image or bio
async function updateProfile(req, res) {
  try {

    const userId = req.user.id; //  retrieve id  from req.user object

    if (!req.user) {
      return res.status(401).json({ message: 'You are not authorzied' })
    };

    const { updatedBio, updatedProfileImage } = req.body

    const updatedProfile = await db.updateProfile(userId, updatedBio, updatedProfileImage);

    res.json({
      message: 'Updated profile successful',
      updatedProfile
    })

    
  } catch (error) {
    console.error('Error updating profile', error)
    res.status(500).json({ error: "Error updating User" });
  }

}


module.exports = {
  getUser,
  getUserProfile,
  createProfile,
  updateProfile
}