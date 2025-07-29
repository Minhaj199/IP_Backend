import { Router } from "express";
import { productController } from "../controller/productController";
const router=Router()
export {router}


router.post('/stock-in',productController.addStock)

