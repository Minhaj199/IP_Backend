import { Document } from "mongoose";
import z from "zod";

export interface IProductId{
    sequence:String
}

export interface IproductidDoc  extends IProductId,Document{}
export interface IProduct{
  productId: string,
  name: string,
  category: CATEGORY,
  unit:UNITS,
  initialStock: number,
  price: number
}
export interface IproductDoc  extends IProduct,Document{}

//////////enums///////

export enum CATEGORY{
NOTBOOK='Notbook',
PEN='Pen',
PENCIL='Pencil'
}
export enum UNITS{
  PIECE='piece',
  BOX='box'
}

export const ZOD_CATEGORY = z.enum(['Pen', 'Pencil', 'Notbook']);
export const ZODE_UNITES=z.enum(['piece','box'])