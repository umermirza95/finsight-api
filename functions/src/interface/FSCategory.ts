export enum FSCategoryType {
  income = "income",
  expense = "expense"
}

export default interface FSCategory {
  id: string
  name: string
  type: FSCategoryType
}
