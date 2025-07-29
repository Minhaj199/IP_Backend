import mongoose from "mongoose";
import { env } from "./env";
import { productIdModel } from "../model/idSequence";
import { generateProductId } from "../utils/idGenerator";
import { productModel } from "../model/productModel";


export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(env.MONGO_URI);
    console.log(`DB connect:${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export async function idSequenceCreation(){
  try {
    const id=await productIdModel.findOne()
    if(!id){
    const lastSequence:{_id:unknown}|null=await productModel.findOne({},{_id:1}).sort({_id:-1})
    if(lastSequence?._id){
      await productIdModel.create({sequence:lastSequence._id.toString()})
    }else{

      await productIdModel.create({sequence:'P0000'})
    }
    }else{
    }
    console.log(generateProductId('P0001'))
  } catch (error) {
    throw new Error('error on id creation')
  }
}
