import z from "zod";
import {  IProduct, IproductDoc, ZOD_CATEGORY, ZODE_UNITES } from "../typesAndEnums";
import mongoose, { Types } from "mongoose";
import { productModel } from "../model/productModel"; 
import { AppError } from "../errors/customError";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { ErrorType } from "../constrains/ErrorTypes";
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

});
export const ProductSchema=z.object({
    name:z.string("invalid product id").trim().min(3,'Enter atleast three chareters').max(20,'Charecter limit is 20'),
    category:ZOD_CATEGORY,
    unit:ZODE_UNITES,
    initialStock:z.coerce.number('stock not found').max(100000,'maximum limt 100000 reached').transform((val) => Math.floor(val)).optional(),
    price:z.coerce.number('price not found').min(0.1,'Insert value more than 0.1').max(10000,'max limit 10000 raeched')
}).refine((data)=>( data.unit!=='Box',{path:['unit'],messege:'not valid'})
)

//////////////// invoice individula invoice entry validation//////////////
export const selectedItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product name is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().nonnegative("Price must be 0 or more"),
  total: z.number().nonnegative("Total must be 0 or more"),
}).refine(
  item => item.total === item.quantity * item.price,
  {
    message: "Total must equal quantity X price",
    path: ["total"]
  }
).array().min(1, "At least one item is required")
type SelectItemType=z.infer<typeof selectedItemSchema>
export const invoiceSchema = z.object({
  customerName: z.string().min(3, "Name is required"),
  customerPhone: z.string().regex(/^[0-9]{10,14}$/, "Phone number must be 10 digits"),
  totalAmount: z.number().nonnegative("Total amount must be 0 or more")
})
// .refine(
//   data => {
//     const calculatedTotal = data.selectedItems.reduce((sum, item) => sum + item.total, 0);
//     return calculatedTotal === data.totalAmount;
//   },
//   {
//     message: "Total amount must match sum of item totals",
//     path: ["totalAmount"]
//   }
// );

export async function InvoiceStockAndTotolValidator(inputItems:SelectItemType,totalAmount:number){
  try {

    //////////// checking total amount and each item total amount is current
    const calculatedTotal = inputItems.reduce((sum, item) => sum + item.total, 0);
  if(calculatedTotal !== totalAmount) throw new Error ('Total amount must match sum of item totals')
    
  ///////////// starting a session/////
  const session=await mongoose.startSession()

  ////////////// feching products///////////

  const prodctIds=inputItems.map(p=>p.productId)
  console.log(prodctIds)
  const products:IproductDoc[]=await productModel.find({_id:{$in:prodctIds}}).session(session)
    
  console.log(products)
  /////////////// creating map to check products and stock//////////

  const productMap=new Map()
  for(const p of products){
    console.log(p)
    productMap.set(p._id ,p)
  } 
      console.log('79')
console.log(productMap.keys())

 // validating stock of items
  for(const item of inputItems){
    console.log(item.productId)
    
    const product=productMap.get(item.productId)
    console.log(product)
    if(!product) throw new Error(`${item.productName} not found`)
      console.log('83')
    if(item.quantity>product.stock){
      throw new Error(`${product.name} only ${product.stock}`)
    }
  }
    console.log(productMap)
 
  // stock update
  const bulkOps=inputItems.map(item=>{
    return {
      updateOne:{
        filter:{_id:item.productId},
        update:{$inc:{stock:-item.quantity}}
      }
    }
  })
 const logResult=await productModel.bulkWrite(bulkOps,{session})
 console.log(logResult)
} catch (error ) {
  if(error instanceof Error){
    throw new Error(error.message)
  }
}
  
 
}