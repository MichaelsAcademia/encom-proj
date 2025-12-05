import express from 'express'
import {
  getAllCarts,
  getCartById,
  getCartByUserId,
  createCart,
  updateCart,
  deleteCart,
  removeItemFromCart,
  updateItemQuantity
} from '../../controllers/carts.js'

const cartRoutes = express.Router()

// Routes
cartRoutes.get('/', getAllCarts)

cartRoutes.get('/id/:id', getCartById)
cartRoutes.get('/:userId', getCartByUserId)

cartRoutes.delete('/:userId/items/:itemId', removeItemFromCart)
cartRoutes.put('/:userId/items/:itemId', updateItemQuantity)

cartRoutes.post('/', createCart)
cartRoutes.put('/:id', updateCart)
cartRoutes.put('/', updateCart)
cartRoutes.delete('/:id', deleteCart)

export default cartRoutes