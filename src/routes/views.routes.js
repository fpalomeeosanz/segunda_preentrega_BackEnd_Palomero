import express from "express";
import { uuidv4 }  from "uuidv4";

const router = express.Router();

router.get ("/", (req,res) => {
    res.render("index", {});
})

router.get ("/realTimeProducts", (req,res) => {
    res.render("realTimeProducts", {});
})

router.post("/home", async (req, res) => {
    const product = {
      name: req.body.name,
      price: req.body.price,
      id: uuidv4(),
    };
  
    await socketServer.emit("createProduct", product);
    res.json(product);
  });


export {router as viewsRouter}