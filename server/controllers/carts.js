import Cart from '../models/carts.js'

// Get all carts
export const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get cart by Id
export const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(400).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get cart by userId
export const getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new cart
export const createCart = async (req, res) => {
    try{
        const cart = new Cart(req.body);
        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

// Update cart
export const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cart) {
            return res.status(400).json({ message: 'Cart not found' });
        };
        res.status(200).json(cart);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete cart
export const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        if (!cart) {
            return res.status(400).json({ message: 'Cart not found' });
        }
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

