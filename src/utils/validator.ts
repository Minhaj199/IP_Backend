import z from "zod";
import { IProduct, ZOD_CATEGORY, ZODE_UNITES } from "../typesAndEnums";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

});
export const ProductSchema=z.object({
    name:z.string("invalid product id").min(3,'Enter atleast three chareters').max(20,'Charecter limit is 20'),
    category:ZOD_CATEGORY,
    unit:ZODE_UNITES,
    initialStock:z.number().optional(),
    price:z.number('price not found')
})