import { Router } from "express";
import { CartManagerFile } from "./managers/CartManagerFile.js";
import { uuidv4 }  from "uuidv4";
import { ProductManagerFile } from "./managers/ProductManagerFile.js";


const path = "carts.json";
const router = Router();
const cartManagerFile = new CartManagerFile(path);
const productManagerFile = new ProductManagerFile(path)

//GET
router.get(`/`, async (req,res) =>{

    const carts = await cartManagerFile.getCarts();

    res.send({
        status: "success",
        msg: `Ruta GET CART`,
        carritos: carts, 
    })
});

router.get(`/:cid`, async (req,res) =>{

    const cid = parseInt(req.params.cid);
    const cart = await cartManagerFile.getCart(cid);

    if (!cart) {
        res.status(404).send({
          status: "error",
          msg: "CARRITO NOT FOUND",
        });
        return;
    }

    res.send({
        status: "success",
        msg: `Ruta GET ID CART con ID: ${cid}`,
    })
});

//POST
router.post(`/`, async (req,res) =>{

    const cid = uuidv4();
    const cart = {
        id: cid,
        products: [],
    };

    await cartManagerFile.createCart(cart);

    res.send({
        status: "succes",
        msg: `Ruta POST CART`,
        carrito: cart,
    })
});

router.post(`/:cid/product/:pid`, async (req,res) =>{
    
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;

    const cart = await cartManagerFile.getCart(cid);
    const product = await productManagerFile.getProduct(pid);

    if (!cart) {
        res.status(404).send({
          status: "error",
          msg: "CARRITO NOT FOUND",
        });
        return;
    }
    if (!product) {
        res.status(404).send({
          status: "error",
          msg: "PRODUCT NOT FOUND",
        });
        return;
    }

    const existingProduct = cart.products.find((p) => p.id === pid);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: pid,
        quantity: quantity,
      });
    }
  
    await cartManagerFile.updateCart(cart);

    res.send({
        status: "succes",
        msg: `Ruta POST CART - AGREGAR PRODUCTO - CID: ${cid}, PID: ${pid}`,
        carrito: cart,
    })
});


//PUT
router.put(`/:cid`, async (req,res) =>{

    const cid = parseInt(req.params.cid);
    const updatedCart = req.body;
    const cart = await cartManagerFile.getCart(cid);

    if (!cart) {
        res.status(404).send({
          status: "error",
          msg: "Cart not found",
        });
        return;
    }

    cart.products = updatedCart.products;

    await cartManagerFile.updateCart(cart);

    res.send({
        status: "succes",
        msg: `Ruta PUT de CART con ID: ${cid}`,
        carrito: cart,
    })
});

//DELETE
router.delete(`/:cid`, async (req,res) =>{

    const cid = parseInt(req.params.cid);
    const deletedCart = await cartManagerFile.deleteCart(cid);

    if (!deletedCart) {
      res.status(404).send({
        status: "error",
        msg: "CARRITO NOT FOUND",
      });
    }

    res.send({
        status: "succes",
        msg: `Ruta DELETE de CART con ID: ${cid}`,
    })
})

export {router as cartRouter};
