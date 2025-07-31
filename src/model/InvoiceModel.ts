import mongoose from "mongoose";
import { generateInvoiceKey } from "../utils/ivoiceIdGenerator";
import { IIvoice, IIvoiceDoc } from "../typesAndEnums";

const schema=new mongoose.Schema<IIvoiceDoc>({
    _id:{type:String},
    customerName:{type:String,require:true},
    customerPhone:{type:String,require:true},
    transaction:[{productId: String,productName:String ,quantity: Number,"price": Number,"total":Number}],
    grandTotoal:{type:Number,required:true}
},{timestamps:true})

export const  invoiceModel= mongoose.model<IIvoiceDoc>('invoices',schema)