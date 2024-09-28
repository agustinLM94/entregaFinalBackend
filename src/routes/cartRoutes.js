import { Router } from 'express';
import { CartManager } from '../managers/cartManager.js';

const cartsRouter = Router();
const cartManager = new CartManager();


cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).send("Error al intentar obtener los carritos");
    }
});


cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.newCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).send("Error al intentar crear el carrito");
    }
});


cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        res.status(500).send("Error al intentar obtener el carrito");
    }
});


cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        res.status(500).send("Error al intentar agregar el producto al carrito");
    }
});


cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json(cart);
    } catch (error) {
        res.status(500).send("Error al intentar actualizar la cantidad del producto en el carrito");
    }
});


cartsRouter.delete('/:cid', async (req, res) => {
    try {
        await cartManager.deleteCart(req.params.cid);
        res.send("Cart deleted");
    } catch (error) {
        res.status(500).send("Error al intentar eliminar el carrito");
    }
});

export { cartsRouter };