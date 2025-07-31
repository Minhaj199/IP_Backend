import { NextFunction, Request, Response } from "express";
import { invoiceSchema, selectedItemSchema } from "../utils/validator";
import { AppError } from "../errors/customError";
import { ZodIssue } from "zod";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { zodArrayFormater, zodFormatedEror } from "../utils/zodFormater";
import { ErrorType } from "../constrains/ErrorTypes";
import { InvoiceStockAndTotolValidator } from "../services/invoiceServices";
import { ERROR_MESSAGES } from "../constrains/Messages";
import { invoiceModel } from "../model/InvoiceModel";
import { invoiceDate } from "../utils/formators";

export const invoiceController = {
  createInvoice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customer, totalAmount, selectedItems } = req.body;
      const { name: customerName, phone: customerPhone } = customer;
      const validateCustomAndTotal = invoiceSchema.safeParse({
        customerName,
        customerPhone,
        totalAmount,
      });
      const validateItems = selectedItemSchema.safeParse(selectedItems);
      if (validateCustomAndTotal.success) {
        if (validateItems.success) {
          const resut = await InvoiceStockAndTotolValidator(
            validateItems.data,
            validateCustomAndTotal.data.totalAmount,
            customerName,
            customerPhone
          );
          if (resut) {
            res.json("success");
          } else {
            throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
          }
        } else {
          const zodErrorsPared: ZodIssue[] = validateItems.error.issues;
          throw new AppError(
            "zod error",
            HttpStatus.BAD_REQUEST,
            ErrorType.ITEM_ERROR,
            zodArrayFormater(zodErrorsPared)
          );
        }
      } else {
        throw new AppError(
          "zod error",
          HttpStatus.BAD_REQUEST,
          ErrorType.FieldError,
          zodFormatedEror(validateCustomAndTotal.error)
        );
      }
    } catch (error) {
      next(error);
    }
  },
  fetchInvoices:async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const {limit=5,page=1}=req.query
      const pageLimit=Number(limit)
      const currentPage=Number(page)
  
      const inv=await invoiceModel.find().sort({_id:-1}).skip((currentPage-1)*pageLimit).limit(pageLimit).lean()
      const count=await invoiceModel.find().countDocuments()
      res.json({invoices:invoiceDate(inv),totalCount:count})

    } catch (error) {
      if(error instanceof Error){

        throw new Error(error.message)
      } 
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
    }
  }
};
