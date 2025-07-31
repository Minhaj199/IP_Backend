import {  IIvoice, IIvoiceDoc, IproductDoc } from "../typesAndEnums";
import mongoose from "mongoose";
import { productModel } from "../model/productModel"; 

import { invoiceModel } from "../model/InvoiceModel";
import { SelectItemType } from "../utils/validator";
import { generateInvoiceKey } from "../utils/ivoiceIdGenerator";

export async function InvoiceCreation(inputItems:SelectItemType,totalAmount:number,customerName:string,customerPhone:string){
 const session = await mongoose.startSession();
   
    try {

    //////////// checking total amount and each item total amount is current
    const calculatedTotal = inputItems.reduce((sum, item) => sum + item.total, 0);
  if(calculatedTotal !== totalAmount) throw new Error ('Total amount must match sum of item totals')
    
  ///////////// starting a session/////
  session.startTransaction();

  ////////////// feching products///////////

  const prodctIds=inputItems.map(p=>(p.productId))
  
  const products:IproductDoc[]=await productModel.find({_id:{$in:prodctIds}}).session(session)
    

  /////////////// creating map to check products and stock//////////

  const productMap=new Map()
  for(const p of products){
   
    productMap.set(p._id ,p)
  } 
     


 // validating stock of items
  for(const item of inputItems){
    const product=productMap.get(item.productId)
    if(!product||product.name!==item.productName) throw new Error(`${item.productName} not found`)
  
    if(item.quantity>product.stock){
      throw new Error(`${product.name} only ${product.stock}`)
    }
  }
//   stock update
  const bulkOps=inputItems.map(item=>{
    return {
      updateOne:{
        filter:{_id:item.productId},
        update:{$inc:{stock:-item.quantity}}
      }
    }
  })
 await productModel.bulkWrite(bulkOps,{session})

 ///////////invoice creation/////////
  const invoiceDoc={
    _id:generateInvoiceKey(),
    customerName,
    customerPhone,
    grandTotoal:totalAmount,
    transaction:inputItems
  }
  const invoice =await invoiceModel.create([invoiceDoc],{session})

 //////////////ending sesssion//

 await session.commitTransaction()
 session.endSession()
 return (invoice)?true:false
} catch (error ) {
    await session.abortTransaction();
    session.endSession();
    console.log(error)
  if(error instanceof Error){
    throw new Error(error.message)
  }else{
    throw new Error('internal server error')
  }
}
  
 
}

export async function InvoiceDeletion(inputItems:SelectItemType,id:string){
const session = await mongoose.startSession();
 session.startTransaction()
 try {
  ////////////// product id and stock mapping////
    const productId=inputItems.map(el=>({_id:el.productId,stock:el.quantity}))
    console.log(productId)
  /////////// buld operation for updating stock////

    const bulkOps=productId.map((el)=>{
      return{
        updateOne:{
          filter:{_id:el._id},
          update:{$inc:{stock:el.stock}}
        }
      }
    })
    await productModel.bulkWrite(bulkOps,{session})
    const result=await invoiceModel.deleteOne({_id:id},{session})
    console.log(result)
    await session.commitTransaction()
    session.endSession()
    return result
 } catch (error) {
 await session.abortTransaction()
  session.endSession()
 }
}