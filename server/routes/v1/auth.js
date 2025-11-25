import express from 'express'
import {
  registerUser,
  loginUser
} from '../../controllers/auth.js'

import { checkEmailExists } from '../../controllers/checkEmail.js'

const authRoutes = express.Router()

// CHECK EMAIL
authRoutes.post('/check-email', checkEmailExists)

// REGISTER
authRoutes.post('/register', registerUser)

// LOGIN
authRoutes.post('/login', loginUser)

export default authRoutes
