import express from 'express'
import {
  getAllCarts,
  getCartById,
  getCartByUserId,
  createCart,
  updateCart,
  deleteCart
} from '../../controllers/carts.js'

const cartRoutes = express.Router()

// Routes
cartRoutes.get('/', getAllCarts)
cartRoutes.get('/:id', getCartById)
cartRoutes.get('/user/:userId', getCartByUserId)
cartRoutes.post('/', createCart)
cartRoutes.put('/:id', updateCart)
cartRoutes.delete('/:id', deleteCart)

export default cartRoutes