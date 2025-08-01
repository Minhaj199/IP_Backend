import mongoose from "mongoose";
import { IStockInData } from "../types/typesAndEnums";
import { productModel } from "../model/product";
import { stockInHistoryModel } from "../model/stockInHistory";


export async function  addStockIn(inputData:IStockInData,id:string){
   const session= await mongoose.startSession()
    try {
    session.startTransaction()
   const result= await productModel.findByIdAndUpdate(id,{$inc:{stock:inputData.quantity}})
   console.log(result)
   if(!result) throw new Error('error on stock updation')
 const result2 = await stockInHistoryModel.create({...inputData})
if(!result2)throw new Error('error on history creatio')
 session.commitTransaction()
    session.endSession()
    return true
    } catch (error) {
        console.log(error)
    session.abortTransaction()
    session.endSession()
        if(error instanceof Error){
            throw new Error(error.message)
        }
    }
}