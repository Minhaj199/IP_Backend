import { Document } from "mongoose";
import z from "zod";

export interface IProductId {
  sequence: String;
}

export interface IproductidDoc extends IProductId, Document {}
export interface IProduct {
  productId: string;
  name: string;
  category: CATEGORY;
  unit: UNITS;
  stock: number;
  price: number;
}
export interface IproductDoc extends IProduct, Document {}

//////////enums///////

export enum CATEGORY {
  NOTBOOK = "Notebook",
  PEN = "Pen",
  PENCIL = "Pencil",
}
export enum UNITS {
  PIECE = "Piece",
  BOX = "Box",
}

export const ZOD_CATEGORY = z.enum(["Pen", "Pencil", "Notebook"], {
  message: "invalid category ",
});
export const ZODE_UNITES = z.enum(["Piece", "Box"], {
  message: "invalid unit",
});

export interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, any>;
}

export const fetchAllProudct = z.object({
  limit: z.coerce
    .number("limit not found")
    .int()
    .min(1, "limit atlease 1")
    .max(10, "limit maximum 10"),
  page: z.coerce.number("current page not found").int(),
});

export interface IIvoice{
  customerName:string,
  customerPhone:string,
  transaction:{productId: string,productName:string ,quantity: number,price: number,total:Number}[]
  grandTotoal:number
}
export interface IIvoiceDoc extends IIvoice,Document{
  createdAt:Date
}


