import { NextFunction, Request, Response } from "express";
import { invoiceSchema, InvoiceStockAndTotolValidator, ProductSchema, selectedItemSchema } from "../utils/validator";
import { AppError } from "../errors/customError";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { ErrorType } from "../constrains/ErrorTypes";
import { zodArrayFormater, zodFormatedEror } from "../utils/zodFormater";
import { fetchAllProudct, IProductId } from "../typesAndEnums";
import { productModel } from "../model/productModel";
import { generateProductId } from "../utils/idGenerator";
import { capitalizeFirstLetter } from "../utils/firstLetterCapitalisor";
import { productIdModel } from "../model/idSequence";
import { ZodIssue } from "zod";



export const productController={
    addStock:async(req:Request,res:Response,next:NextFunction)=>{
       
        try {
            
            const validateProductData=ProductSchema.safeParse(req.body)
            console.log(validateProductData.data)
            const currentSequence:IProductId|null=await productIdModel.findOne({},{sequence:1})
            console.log(currentSequence)
            if(validateProductData.success){
                if(currentSequence?.sequence!==null&&typeof currentSequence?.sequence==='string'){
                    const insertData={...validateProductData.data,stock:validateProductData.data.initialStock,_id:generateProductId(currentSequence.sequence),name:capitalizeFirstLetter(validateProductData.data.name)}
                    const result=await productModel.create(insertData)
                    if(result){
                        await productIdModel.updateOne({sequence:currentSequence.sequence},{$set:{sequence:result._id}})
                        return res.json(result)
                    }else{
                        throw new AppError('Error on product creation',HttpStatus.INTERNAL_SERVER_ERROR,ErrorType.GeneralError,{'general':'interanal server error'})
                    }
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
    },
    fetchAllProudct:async(req:Request,res:Response,next:NextFunction)=>{
        try {
            
            console.log(req.query)
            const validatQuery=fetchAllProudct.safeParse(req.query)
            
        if(validatQuery.success){
            console.log(validatQuery)
            const totalCount=await productModel.find().countDocuments()
            const fetchProducts=await productModel.find().sort({_id:-1}).skip((validatQuery.data.page-1)*validatQuery.data.limit).limit(validatQuery.data.limit)
            return res.json( {totalCount,products:fetchProducts}
)
        }else{
            throw new AppError('zod validation failed',HttpStatus.BAD_REQUEST,ErrorType.GeneralError,zodFormatedEror(validatQuery.error))
        }
        } catch (error) {
            console.log(error)
            next(error)
            
        }
    } ,
    fechprodutsData:async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const fetchProducts=await productModel.find().sort({_id:-1})
            return res.json([...fetchProducts])
        } catch (error) {
            next(error)
            
        }
    },
    fechprodutName:async(req:Request,res:Response,next:NextFunction)=>{
        try {
           
          
          
            const data=await productModel.find({},{name:1,stock:1,price:1,unit:1})
            
            res.json({products:data})
           
           
            
          
           
        } catch (error) {
         console.log(error)   
        }
    },  
    
}