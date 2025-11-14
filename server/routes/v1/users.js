import express from 'express'
import {
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser
} from '../../controllers/users.js'

const userRoutes = express.Router()

// Routes
userRoutes.get('/', getAllUsers)
userRoutes.get('/:username', getUserByUsername)
userRoutes.put('/:username', updateUser)
userRoutes.delete('/:username', deleteUser)

export default userRoutes
