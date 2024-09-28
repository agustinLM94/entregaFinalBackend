import { Router } from "express";
import { productManager } from "../app.js";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from 'uuid';

const productsRoutes = Router();

productsRoutes.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            return res.json(limitedProducts);
        } else {
            return res.json(products);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al intentar recibir los productos");
    }
});

productsRoutes.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al intentar recibir el producto con el id: ${pid}`);
    }
});

productsRoutes.post("/", async (req, res) => {
    try {
        const { nombre, precio, descripcion, categoria } = req.body;
        if (!nombre || !precio || !descripcion || !categoria) {
            return res.status(400).send("Faltan datos en la solicitud");
        }

        const newProduct = {
            nombre,
            precio,
            descripcion,
            categoria,
            imagen: "/img/rugby.gif"
        };

        const response = await productManager.addProduct(newProduct);
        res.status(201).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al intentar agregar producto");
    }
});

productsRoutes.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const { nombre, descripcion, precio, categoria } = req.body;
        if (!nombre || !descripcion || !precio || !categoria) {
            return res.status(400).send("Faltan datos en la solicitud");
        }

        const response = await productManager.updateProduct(pid, { nombre, descripcion, precio, categoria });
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al intentar editar producto con id ${pid}`);
    }
});

productsRoutes.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(pid);
        res.send("Product Deleted");
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error al intentar eliminar el producto con id: ${pid}`);
    }
});


productsRoutes.post("/import-stock", async (req, res) => {
    try {
        const stockData = await fs.readFile('./src/data/stock.json', 'utf8');
        const stockProducts = JSON.parse(stockData);

        for (const product of stockProducts) {
            
            if (!product.id) {
                product.id = uuidv4();
            }
           
            await productManager.addProduct(product);
        }

        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al intentar importar el stock");
    }
});

export { productsRoutes };