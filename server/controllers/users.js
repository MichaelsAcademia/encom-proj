import User from '../models/users.js'

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' })
        }

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get user by USERNAME
export const getUserByUsername = async (req, res) => {

    const {
        basic=false
    } = req.query

    const USERNAME = req.params.username

    try {

        let query = User.findOne({ username: USERNAME.toLowerCase() })

        if (basic === 'true') {
            query = query.select('_id username picture rating')
        }

        const user = await query;

        if (!user) {
            return res.status(404).json({ message: `User ${USERNAME} not found` })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get user by ID
export const getUserById = async (req, res) => {

    console.log("Fetching user by ID:", req.params.id);

    const {
        basic=false
    } = req.query

    const USER_ID = req.params.id

    try {

        let query = User.findById(USER_ID)

        if (basic === 'true') {
            query = query.select('_id username picture rating')
        }

        const user = await query;

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        const userData = await { username: user.username, picture: user.picture, rating: user.rating, bio: user.bio, createdAt: user.createdAt, updatedAt: user.updatedAt };


        res.status(200).json({seller: userData})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update user
export const updateUser = async (req, res) => {
    const USERNAME = req.params.username

    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: USERNAME.toLowerCase() },
            {$set: req.body},
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ user: updatedUser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// delete user
export const deleteUser = async (req, res) => {
    const USERNAME = req.params.username

    try {
        const deletedUser = await User.findOneAndDelete({ username: USERNAME.toLowerCase() })

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}