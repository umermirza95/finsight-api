
export enum FSTransactionType {
    income = "income",
    expense = "expense"
}

export enum FSTransactionMode{
    card = "card",
    cash = "cash",
    transfer = "transfer",
    online = "online"
}


export default class FSTransaction {
  id = "";
  type: FSTransactionType = FSTransactionType.expense;
  mode: FSTransactionMode = FSTransactionMode.online;
  amount = 0;
  categoryId="";
  date = 0;
}
