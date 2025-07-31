import { Router } from "express";
import { productController } from "../controller/productController";
import { invoiceController } from "../controller/InvoiceController";
const router=Router()
export {router}


router.post('/add-product',productController.addStock)
router.get('/stock-list',productController.fetchAllProudct)
router.put('/stock-in/:id',productController.stockIn)

///////////////// fetch prodct data when field input
router.get('/fetch-productsdata',productController.fechprodutsData)
router.get('/fetch-productname',productController.fechprodutName)
router.get('/fetch-stock/:id',productController.fetchStock)

router.post('/add-invoice',invoiceController.createInvoice)
router.get('/fetch-invoice',invoiceController.fetchInvoices)
router.delete('/delete-invoice/:id',invoiceController.deleteInvoice)

