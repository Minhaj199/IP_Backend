import { ZodError } from "zod";
import { ErrorType } from "../constrains/ErrorTypes";

export function zodFormatedEror(zodData: ZodError): Record<string, string>{
    console.log(zodData)
  const errorData:Record<string, string>={}
    zodData.issues.forEach((issue) => {
    const field = issue.path.join(".") || ErrorType.GeneralError;
     errorData[field]=issue.message 
  });
  console.log(zodData)
  return errorData
}