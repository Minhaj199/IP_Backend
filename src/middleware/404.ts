import { Request, Response } from "express";

export const pageNotFount=(_req:Request, res:Response) => {
        res.status(404).json({message:"Sorry, the page you requested cannot be found."});
  }