
export enum FSTransactionType {
  income = "income",
  expense = "expense"
}

export enum FSTransactionMode {
  card = "card",
  cash = "cash",
  transfer = "transfer",
  online = "online"
}

export enum FSSupportedCurrencies {
  PKR = "PKR",
  USD = "USD"
}


export default interface FSTransaction {
  id: string;
  amount: number;
  baseAmount: number;
  processingFeePercent?: number;
  categoryId: string;
  subCategoryId?: string
  currency?: string,
  date: Date;
  updatedAt: Date;
  type: FSTransactionType;
  mode: FSTransactionMode;
}
