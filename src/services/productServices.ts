import mongoose from "mongoose";
import { IStockInData } from "../typesAndEnums";
import { productModel } from "../model/product";
import { stockInHistoryModel } from "../model/stockInHistory";


export async function  addStockIn(inputData:IStockInData,id:string){
   const session= await mongoose.startSession()
    try {
    session.startTransaction()
    await productModel.findByIdAndUpdate(id,{$inc:{stock:inputData.quantity}})
    await stockInHistoryModel.create({...inputData})
    session.commitTransaction()
    session.endSession()
    return true
    } catch (error) {
    session.abortTransaction()
    session.endSession()
        if(error instanceof Error){
            throw new Error(error.message)
        }
    }
}