import { NextFunction, Request, Response } from "express"
import { invoiceSchema, InvoiceStockAndTotolValidator, selectedItemSchema } from "../utils/validator"
import { AppError } from "../errors/customError"
import { ZodIssue } from "zod"
import { HttpStatus } from "../constrains/statusCodeContrain"
import { zodArrayFormater, zodFormatedEror } from "../utils/zodFormater"
import { ErrorType } from "../constrains/ErrorTypes"

export const invoiceController={
createInvoice:async(req:Request,res:Response,next:NextFunction)=>{
        try {
           const {customer,totalAmount,selectedItems}=req.body
           const {name:customerName,phone:customerPhone }=customer
          const validateCustomAndTotal=invoiceSchema.safeParse({customerName,customerPhone,totalAmount})  
          const validateItems=selectedItemSchema.safeParse(selectedItems)  
          if(validateCustomAndTotal.success){
            console.log(validateCustomAndTotal.data)
            if(validateItems.success){
               await InvoiceStockAndTotolValidator(validateItems.data,validateCustomAndTotal.data.totalAmount)
                res.json('success')
            }else{
              const zodErrorsPared: ZodIssue[] = validateItems.error.issues;
              throw new AppError('zod error',HttpStatus.BAD_REQUEST,ErrorType.ITEM_ERROR,zodArrayFormater(zodErrorsPared))
            }
          }else{
           throw new AppError('zod error',HttpStatus.BAD_REQUEST,ErrorType.FieldError,zodFormatedEror(validateCustomAndTotal.error))
          }            
        } catch (error) {
            next(error)
        }
    } 
}