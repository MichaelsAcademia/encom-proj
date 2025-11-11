import e from 'express'
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

  const USERNAME = req.params.username

    try {
        const user = await User.findOne({ username: USERNAME.toLowerCase() })

        if (!user) {
            return res.status(404).json({ message: `User ${USERNAME} not found` })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create a new user
export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const existingUser = await User.findOne({ $or: [ { username }, { email } ] })
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' })
        }

        const newUser = new User({
          username: username.toLowerCase(), // Currently saving usernames as lowercase to avoid case sensitivity issues
          email,
          password
        })
        await newUser.save()

        res.status(201).json({ user: newUser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update user
export const updateUser = async (req, res) => {
    const USERNAME = req.params.username

    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: USERNAME },
            req.body,
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
        const deletedUser = await User.findOneAndDelete({ username: USERNAME })

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}