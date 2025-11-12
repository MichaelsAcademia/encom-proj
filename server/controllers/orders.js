import Order from '../models/orders.js'

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get order by Id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new order
export const createOrder = async (req, res) => {
    try{
        const order = new Order(req.body);
        const savedOrder = await order.save();
        res.status(200).json(savedOrder);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// update order
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        };
        res.status(200).json(order);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}