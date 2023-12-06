import express from "express";
import { cartRouter } from "./routes/carts.routes.js";
import { productRouter } from "./routes/products.routes.js";
import { server } from "socket.io";
import handlebars from "express-handlebars";


const PORT = 8080;
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended : true }))

app.listen(PORT, () => {
    console.log (`SERVIDOR FUNCIONANDO EN EL PUERTO: ${PORT}`);
})

const httpServer = app.listen(PORT);
const socketServer = new server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"))
app.use("/", viewsRouter);

socketServer.on("conetcion", (socket) => {
    console.log("Nuevo cliente conectado")
})

socket.broadcast.emit();
socket.emit();

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
   