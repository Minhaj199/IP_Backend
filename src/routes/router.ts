import { Router } from "express";
import { productController } from "../controller/productController";
import { invoiceController } from "../controller/InvoiceController";
const router=Router()
export {router}


router.post('/add-product',productController.addStock)
router.get('/stock-list',productController.fetchAllProudct)
router.get('/stock-in',productController.fetchAllProudct)

///////////////// fetch prodct data when field input
router.get('/fetch-productsdata',productController.fechprodutsData)
router.get('/fetch-productname',productController.fechprodutName)
router.post('/add-invoice',invoiceController.createInvoice)
