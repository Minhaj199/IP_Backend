import { NextFunction, Request, Response } from "express";
import { ProductSchema, selectedItemSchema, stockInSchema } from "../utils/validator";
import { AppError } from "../errors/customError";
import { HttpStatus } from "../constrains/statusCodeContrain";
import { ErrorType } from "../constrains/ErrorTypes";
import { zodFormatedEror } from "../utils/zodFormater";
import { fetchAllProudct, IProductId } from "../typesAndEnums";
import { productModel } from "../model/productModel";
import { generateProductId } from "../utils/idGenerator";
import { capitalizeFirstLetter } from "../utils/firstLetterCapitalisor";
import { productIdModel } from "../model/idSequence";
import { ERROR_MESSAGES } from "../constrains/Messages";
import { addStockIn } from "../services/productServices";

export const productController = {
  addStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateProductData = ProductSchema.safeParse(req.body);

      const currentSequence: IProductId | null = await productIdModel.findOne(
        {},
        { sequence: 1 }
      );

      if (validateProductData.success) {
        if (
          currentSequence?.sequence !== null &&
          typeof currentSequence?.sequence === "string"
        ) {
          const insertData = {
            ...validateProductData.data,
            stock: validateProductData.data.initialStock,
            _id: generateProductId(currentSequence.sequence),
            name: capitalizeFirstLetter(validateProductData.data.name),
          };
          const result = await productModel.create(insertData);
          if (result) {
            await productIdModel.updateOne(
              { sequence: currentSequence.sequence },
              { $set: { sequence: result._id } }
            );
            return res.json(result);
          } else {
            throw new AppError(
              "Error on product creation",
              HttpStatus.INTERNAL_SERVER_ERROR,
              ErrorType.GeneralError,
              { general: "interanal server error" }
            );
          }
        } else {
          throw new Error("id sequence not found");
        }
      } else {
        throw new AppError(
          "zod validation failed",
          HttpStatus.BAD_REQUEST,
          ErrorType.FieldError,
          zodFormatedEror(validateProductData.error)
        );
      }
    } catch (error) {
      next(error);
    }
  },
  fetchAllProudct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatQuery = fetchAllProudct.safeParse(req.query);

      if (validatQuery.success) {
        const totalCount = await productModel.find().countDocuments();
        const fetchProducts = await productModel
          .find()
          .sort({ _id: -1 })
          .skip((validatQuery.data.page - 1) * validatQuery.data.limit)
          .limit(validatQuery.data.limit);
        return res.json({ totalCount, products: fetchProducts });
      } else {
        throw new AppError(
          "zod validation failed",
          HttpStatus.BAD_REQUEST,
          ErrorType.GeneralError,
          zodFormatedEror(validatQuery.error)
        );
      }
    } catch (error) {
      next(error);
    }
  },
  fechprodutsData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fetchProducts = await productModel.find().sort({ _id: -1 });
      return res.json([...fetchProducts]);
    } catch (error) {
      next(error);
    }
  },
  fechprodutName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await productModel.find({stock:{$gt:0}},
        { name: 1, stock: 1, price: 1, unit: 1 }
      );

      res.json({ products: data });
    } catch (error) {
      next(error);
    }
  },
   fetchStock: async (req: Request, res: Response, next: NextFunction) => {
      const {id} =req.params
     try {
       const currentStock= await productModel.findOne({_id:id},{stock:1,_id:0})
       if(currentStock){
         res.json(currentStock)
       }
     } catch (error) {
       throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
     }
  },
  stockIn:async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const {id} =req.params
      if(!id||id.length<3){
        throw new Error('id not found')
      }
      const validateUpdateData=stockInSchema.safeParse(req.body)
      if(validateUpdateData.success){
        await addStockIn(validateUpdateData.data,id)
        res.json({success:true})
      }else{
        throw new AppError('zod error',HttpStatus.BAD_REQUEST,ErrorType.FieldError,zodFormatedEror(validateUpdateData.error))
      }
    } catch (error) {
      next(error)
    }
  }
};
