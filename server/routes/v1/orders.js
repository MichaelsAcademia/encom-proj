import express from 'express'
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../../controllers/orders.js'

const orderRoutes = express.Router()

// Routes
orderRoutes.get('/', getAllOrders)
orderRoutes.get('/:id', getOrderById)
orderRoutes.post('/', createOrder)
orderRoutes.put('/:id', updateOrder)
orderRoutes.delete('/:id', deleteOrder)

export default orderRoutes
