export enum FSCategoryType {
    income = "income",
    expense = "expense"
}

export default class FSCategory {
  id = "";
  name = "";
  type: FSCategoryType = FSCategoryType.expense;
}
