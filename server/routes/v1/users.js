import express from 'express'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../../controllers/users.js'

const userRoutes = express.Router()

// Routes
userRoutes.get('/', getAllUsers)
userRoutes.get('/:username', getUserById)
userRoutes.post('/', createUser)
userRoutes.put('/:username', updateUser)
userRoutes.delete('/:username', deleteUser)

export default userRoutes
