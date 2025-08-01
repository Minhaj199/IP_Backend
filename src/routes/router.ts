import { Router } from "express";
import { productController } from "../controller/productController";
import { invoiceController } from "../controller/InvoiceController";
const router=Router()
export {router}


router.post('/add-product',productController.addStock)
router.patch('/stock-in/:id',productController.stockIn)
router.get('/stock-list',productController.fetchAllProudct)




///////////////// fetch prodct data when field input
////////// for stock in
router.get('/fetch-productsdata',productController.fechprodutsData)
    ///////////// its for invoice creation/////
router.get('/fetch-productname',productController.fechprodutName)

router.post('/add-invoice',invoiceController.createInvoice)
router.get('/fetch-invoice',invoiceController.fetchInvoices)
router.delete('/delete-invoice/:id',invoiceController.deleteInvoice)

