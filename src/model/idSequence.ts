import mongoose from "mongoose";
import { IproductidDoc } from "../typesAndEnums";


const schema=new mongoose.Schema<IproductidDoc>({
    sequence:{type:String}
})

export const productIdModel=mongoose.model<IproductidDoc>('id_seq',schema)