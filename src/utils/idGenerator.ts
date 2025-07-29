export function generateProductId(lastId: string): string {
  const num = parseInt(lastId.replace("P", "")) + 1;
  return "P" + num.toString().padStart(4, "0"); 
}