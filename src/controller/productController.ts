import { NextFunction, Request, Response } from "express";
import { ProductSchema } from "../utils/validator";
import { productIdModel } from "../model/idSequence";
import { AppError } from "../errors/customError";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { ErrorType } from "../constrains/ErrorTypes";
import { zodFormatedEror } from "../utils/zodFormater";
import { IProductId } from "../typesAndEnums";
import { productModel } from "../model/productModel";
import { generateProductId } from "../utils/idGenerator";

export const productController={
    addStock:async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const validateProductData=ProductSchema.safeParse(req.body)
            const currentSequence:IProductId|null=await productIdModel.findOne({},{sequence:1})
            console.log(currentSequence)
            if(validateProductData.success){
                if(currentSequence?.sequence!==null&&typeof currentSequence?.sequence==='string'){
                    const insertData={...validateProductData.data,_id:generateProductId(currentSequence.sequence)}
                    console.log('here')
                    const result=await productModel.create(insertData)
                    return res.json(result)
                }else{
                    throw new Error('id sequence not found')
                }
            }else{
                throw new AppError('zod validation failed',HttpStatus.BAD_REQUEST,ErrorType.FieldError,zodFormatedEror(validateProductData.error))
            }
        } catch (error) {
            console.log(error)
         next(error)   
        }
    }  
}