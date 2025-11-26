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
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = await Cart.create({
                userId: req.params.userId,
                items: []
            });
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


export const removeItemFromCart = async (req, res) => {
    const { userId, itemId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        res.status(200).json({
            message: "Item removed",
            cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateItemQuantity = async (req, res) => {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        item.quantity = quantity;
        await cart.save();
        res.status(200).json({
            message: "Quantity updated",
            cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};