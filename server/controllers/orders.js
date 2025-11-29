import Order from '../models/orders.js'
import Cart from '../models/carts.js'
import Listing from '../models/listings.js'

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
        const { userId } = req.body;
       
         const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderItems = await Promise.all(
            cart.items.map(async (item) => {
                const listing = await Listing.findById(item.listingId);

                return {
                    listingId: item.listingId,
                    quantity: item.quantity,
                    priceAtCheckout: listing.price 
                };
            })
        );

        const total = orderItems.reduce(
            (sum, item) => sum + item.quantity * item.priceAtCheckout,
            0
        );

        const order = new Order({
            userId,
            items: orderItems,
            total
        });

        const savedOrder = await order.save();

        cart.items = [];
        await cart.save();

        return res.status(200).json({
            message: "Order placed was successfully",
            order: savedOrder
        });
   
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