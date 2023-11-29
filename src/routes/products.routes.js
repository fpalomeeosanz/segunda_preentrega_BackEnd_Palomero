import { Router } from "express";
import { ProductManagerFile } from "./managers/ProductManagerFile.js";
import { uuidv4 }  from "uuidv4";

const path = "products.json";
const router = Router();
const productManagerFile = new ProductManagerFile(path);

//GET
router.get(`/`, async (req,res) =>{

    const limit = parseInt(req.query.limit);
    const products = await productManagerFile.getProducts(limit);

    res.send({
        status: "success",
        msg: `Ruta GET PRODUCTS`,
        productos: products,
    })
});

router.get(`/:pid`, async (req,res) =>{

    const pid = parseInt(req.params.pid);
    const product = await productManagerFile.getProductById(pid);

    if (!product) {
        res.status(404).json({
          status: "error",
          msg: `Ruta PRODUCTO: NOT FOUND`,
        });
        return;
    }
    res.send({
        status: "success",
        msg: `Ruta GET PRODUCT ID: ${pid}`,
        producto: product,
    })
});

//POST
router.post(`/`, async (req,res) =>{

    const product = req.body; 
    const id = uuidv4(); 
    product.id = id;
    product.status = true;
    product.title = req.body.title;
    product.description = req.body.description;
    product.code = req.body.code;
    product.price = req.body.price;
    product.stock = req.body.stock;
    product.category = req.body.category;

    const createdProduct = await productManagerFile.createProduct(product);

    res.send({
        status: "success",
        msg: `Ruta PRODUCTO: ${pid} CREADO`,
        producto: createdProduct,
    })
});

//PUT
router.put(`/:pid`, async (req,res) =>{

    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body;

    if (!updatedProduct || !updatedProduct.title || !updatedProduct.price) {
        res.status(400).send({
          status: "error",
          msg: "COMPLETA LOS CAMPOS: title, price",
        });
      return;
    }

    updatedProduct.id = pid;
      
    const updatedProductResponse = await productManagerFile.updateProduct(pid, updatedProduct);
    
    if (!updatedProductResponse) {
        res.status(404).send({
          status: "error",
          msg: `Ruta PRODUCTO: NOT FOUND`,
        });
    }

    res.send({
        status: "success",
        msg: `Ruta PUT de PRODUCTS con ID: ${pid}`,
        producto: updatedProductResponse,
    })
});

//DELETE
router.delete(`/:pid`, async (req,res) =>{

    const pid = parseInt(req.params.pid);
    const deletedProductResponse = await productManagerFile.deleteProduct(pid);

    if (!deletedProductResponse) {
      res.status(404).send({
        status: "error",
        msg: `Ruta PRODUCTO: NOT FOUND`,
      })
    }

    res.send({
        status: "success",
        msg: `Ruta DELETE de PRODUCTS con ID: ${pid}`,
        producto: deletedProductResponse,
    })
});

export {router as productRouter}