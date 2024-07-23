import { Router } from "express";
import {getUsuariostoLog ,getAllProducts, getProducts,getProduct, newProduct, updateQTYProduct, getUser,updateStatusProduct,getRoles,getRol, specialQuery, newRegisterHistory, getHistory} from "../controllers/products.controllers.js";

const router = Router();
router.post("/historial",newRegisterHistory);
router.get("/historial/:modulo",getHistory)
router.post("/login", getUsuariostoLog);
router.get("/usuario/:id",getUser);
router.get("/roles",getRoles)
router.get("/rol/:id",getRol)
router.get("/productos",getAllProducts);
router.get("/productosIn/:estatus",getProducts);
router.get('/productos/:id',getProduct);
router.get('/producto/:nombre', newProduct);
router.put('/producto/:id', updateQTYProduct);
router.put('/productos/:id', updateStatusProduct);
router.get('/special/:id', specialQuery);

export default router;