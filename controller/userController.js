const db = require('../prisma/queries')


// GET - data about logged in user
async function getUser(req, res) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    const { id, username } = req.user;    // destrucure to retrieve id, username from req.user object
    
    const data = await db.getProfileOfUser(id)

    const profile_image = data.profile_image

    res.json({
      message: `${username}'!`,
      username, // Data from jwt payload,
      profile_image,
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

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const { id } = req.user;
  



    const profile = await db.getProfileOfUser(id)

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

    if (!req.user) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    const { id } = req.user;

    const { bio } = req.body;
    const profileImage = req.file ? req.file.location :  '/images/default.png';  // Use default image if no file is uploaded.   req.file.location for s3, req.file.path for local

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
    
    if (!req.user) {
      return res.status(401).json({ message: 'You are not authorzied' })
    };
    
    const userId = req.user.id; //  retrieve id  from req.user object

    const updatedBio = req.body.updatedBio
    const image = req.body.updatedProfileImage
    
    const updatedProfileImage = req.file ? req.file.location : image;  // Only update image if a new one is uploaded

    const updatedProfile = await db.updateProfile(userId, updatedBio, updatedProfileImage);

    if (!updatedProfile) {
      return res.status(500).json({error: 'Error updating profile'})
    }

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