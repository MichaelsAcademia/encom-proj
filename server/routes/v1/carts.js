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

import { protect } from '../../middleware/authMiddleware.js';

const cartRoutes = express.Router()

// Routes
cartRoutes.get('/', getAllCarts)

cartRoutes.get('/id/:id', getCartById)
cartRoutes.get('/:userId', protect, getCartByUserId)

cartRoutes.delete('/:userId/items/:itemId',protect, removeItemFromCart)
cartRoutes.put('/:userId/items/:itemId', protect, updateItemQuantity)

cartRoutes.post('/', createCart)
cartRoutes.put('/:id', updateCart)
cartRoutes.delete('/:id', deleteCart)

export default cartRoutes