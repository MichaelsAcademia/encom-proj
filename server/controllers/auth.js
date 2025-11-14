import User from '../models/users.js'
import { generateToken } from '../utils/jwt.js';

// Register a new user
export const registerUser = async (req, res) => {
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

        const token = generateToken(newUser)

        if (!token) {
            return res.status(500).json({ message: 'Error creating user' })
        }

        res.status(201).json({ user: newUser, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email })
    const verified = await user.comparePassword(password)

    if (!verified || !user) {
      return res.status(400).json({ message: 'Invalid username or password' })
    }

    const token = generateToken(user)

    if (!token) {
      return res.status(400).json({ message: 'Error Logging in' })
    }

    res.status(200).json({ message: 'Login successful', user, token })
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' })
  }
};