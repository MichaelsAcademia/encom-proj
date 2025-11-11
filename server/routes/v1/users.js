import express from 'express'
import {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser
} from '../../controllers/users.js'

const userRoutes = express.Router()

// Routes
userRoutes.get('/', getAllUsers)
userRoutes.get('/:username', getUserByUsername)
userRoutes.post('/', createUser)
userRoutes.put('/:username', updateUser)
userRoutes.delete('/:username', deleteUser)

export default userRoutes
