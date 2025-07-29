import mongoose from "mongoose";
import { CATEGORY, IProduct, IproductDoc, UNITS } from "../typesAndEnums";

const schema=new mongoose.Schema<IproductDoc>({
    _id:String,
    name:{type:String,unique:true,required:true},
    category:{type:String,enum:CATEGORY,required:true},
    unit:{type:String,enum:UNITS,required:true},
    initialStock:{type:Number,default:0}

})
export  const productModel=mongoose.model<IproductDoc>('products',schema)

