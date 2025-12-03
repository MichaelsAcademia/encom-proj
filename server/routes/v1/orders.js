import express from 'express'
import {
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  createOrder,
  updateOrder,
  deleteOrder
} from '../../controllers/orders.js'

const orderRoutes = express.Router()

// Routes
orderRoutes.get('/', getAllOrders)
orderRoutes.get('/:id', getOrderById)
orderRoutes.get('/user/:userId', getOrderByUserId)
orderRoutes.post('/', createOrder)
orderRoutes.put('/:id', updateOrder)
orderRoutes.delete('/:id', deleteOrder)

export default orderRoutes
