import mongoose from "mongoose";
import { CATEGORY, IStockInDataDoc } from "../typesAndEnums";

const schema=new mongoose.Schema<IStockInDataDoc>({
  quantity: {type:Number,require:true},
  source: {type:String,require:true},
  productId: {type:String,require:true,ref:'products'},
  currentStock: {type:Number,require:true},
  category: {type:String,enum:CATEGORY,required:true}
},{timestamps:true})

export const stockInHistoryModel=mongoose.model<IStockInDataDoc>('stockHistoy',schema)