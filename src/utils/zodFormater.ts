import { ZodError, ZodIssue } from "zod";
import { ErrorType } from "../types/errorTypes"; 


export function zodFormatedEror(zodData: ZodError): Record<string, string> {
  console.log(zodData);
  const errorData: Record<string, string> = {};
  zodData.issues.forEach((issue) => {
    const field = issue.path.join(".") || ErrorType.GeneralError;
    errorData[field] = issue.message;
  });
  return errorData;
}

export function zodArrayFormater(zodErrors: ZodIssue[]) {
  const formatted: Record<string, string> = {};

  for (const err of zodErrors) {
    console.log(err.message);
    const path = err.path;
    if (
      Array.isArray(path) &&
      path.length === 2 &&
      typeof path[0] === "number" &&
      typeof path[1] === "string"
    ) {
      const index = path[0];
      console.log([path[1]]);
      if (!(index in formatted)) {
        formatted[index] = err.message;
      }
    }
    console.log("28");
    // console.log(formatted)
    return formatted;
  }
}
