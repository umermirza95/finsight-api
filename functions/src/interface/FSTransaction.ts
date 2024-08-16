
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


export default interface FSTransaction {
  id: string;
  type: FSTransactionType;
  mode: FSTransactionMode;
  amount: number;
  categoryId: string;
  date: Date;
  updatedAt: Date;
}
