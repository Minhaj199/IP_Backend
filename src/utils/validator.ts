import z, { optional } from "zod";
import { ZOD_CATEGORY, ZODE_UNITES } from "../types/typesAndEnums";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  FRONTEND_URL:z.url()
});
export const ProductSchema = z
  .object({
    name: z
      .string("invalid product id")
      .trim()
      .min(3, "Enter atleast three chareters")
      .max(20, "Charecter limit is 20"),
    category: ZOD_CATEGORY,
    unit: ZODE_UNITES,
    initialStock: z.coerce
      .number("stock not found")
      .nonnegative('negetive not accepted')
      .int('decimal value not valid')
      .max(100000, "maximum limt 100000 reached")
      .transform((val) => Math.floor(val))
      .optional(),
    price: z.coerce
      .number("price not found")
      .min(0.1, "Insert value more than 0.1")
      .max(10000, "max limit 10000 raeched"),

  })
  .refine(
    (data) => (data.unit !== "Box", { path: ["unit"], messege: "not valid" })
  );

//////////////// invoice individula invoice entry validation//////////////
export const selectedItemSchema = z
  .object({
    productId: z.string().min(1, "Product ID is required"),
    productName: z.string().min(1, "Product name is required"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    price: z.number().nonnegative("Price must be 0 or more"),
    total: z.number().nonnegative("Total must be 0 or more"),
  })
  .refine((item) => item.total === item.quantity * item.price, {
    message: "Total must equal quantity X price",
    path: ["total"],
  })
  .array()
  .min(1, "At least one item is required");
export type SelectItemType = z.infer<typeof selectedItemSchema>;
export const invoiceSchema = z.object({
  customerName: z.string().min(3, "Name is required"),
  customerPhone: z
    .string()
    .regex(/^[0-9]{10,14}$/, "Phone number must be 10 digits"),
  totalAmount: z.number().nonnegative("Total amount must be 0 or more"),
});

export const stockInSchema = z.object({
  quantity: z.coerce
    .number("quenatity required")
    .positive("possitive number required")
    .int("decimimal value not valid"),
  source: z
    .string("source required")
    .trim()
    .min(2, "please add more word")
    .max(20, "max limit reached 20 reached"),
  remark: z.string().trim().min(3, "add more word").max(50, "word").optional(),
  productId: z.string("product id is required").min(3, "give valid id"),
  currentStock: z.number("current stock required").int("valid number required").nonnegative('negtive number').min(1,'please add valid stock'),
  category: ZOD_CATEGORY,
});
