import express from 'express'
import {
  getAllUsers,
  getUserByUsername,
  getUserById,
  updateUser,
  deleteUser
} from '../../controllers/users.js'
import { protect } from "../../middleware/authMiddleware.js"

const userRoutes = express.Router()

// Routes
userRoutes.get('/', protect, getAllUsers)
userRoutes.get('/:username', getUserByUsername)
userRoutes.get('/seller/:id', getUserById)
userRoutes.put('/:username', protect, updateUser)
userRoutes.delete('/:username', protect, deleteUser)

export default userRoutes
