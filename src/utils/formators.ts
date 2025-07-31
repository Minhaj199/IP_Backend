import { IIvoiceDoc } from "../typesAndEnums";

export function invoiceDate(MongoData: IIvoiceDoc[]) {
  if (MongoData.length === 0) return [];
  const data = MongoData.map((inv) => {
    const data = {
      _id: inv._id,
      customer: { name: inv.customerName, phone: inv.customerPhone },
      createdAt: inv.createdAt,
      items: inv.transaction,
      totalAmount: inv.grandTotoal,
    };
    return data;
  });
  return data;
}
