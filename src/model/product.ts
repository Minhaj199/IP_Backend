import mongoose from "mongoose";
import { CATEGORY, IproductDoc, UNITS } from "../typesAndEnums";

const schema=new mongoose.Schema<IproductDoc>({
    _id:String,
    name:{type:String,unique:true,required:true},
    category:{type:String,enum:CATEGORY,required:true},
    unit:{type:String,enum:UNITS,required:true},
    stock:{type:Number,default:0},
    price:{type:Number,required:true}
})
export  const productModel=mongoose.model<IproductDoc>('products',schema)

