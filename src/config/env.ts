import dotenv from "dotenv";
import path from "path";
import { envSchema } from "../utils/validator";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  NODE_ENV: parsedEnv.data.NODE_ENV,
  PORT: Number(parsedEnv.data.PORT),
  MONGO_URI: parsedEnv.data.MONGO_URI,
 
};
