import express from 'express'
import {
  registerUser,
  loginUser,
  checkEmailExists
} from '../../controllers/auth.js'

const authRoutes = express.Router()


authRoutes.post('/check', checkEmailExists)
authRoutes.post('/register', registerUser)
authRoutes.post('/login', loginUser)

export default authRoutes
