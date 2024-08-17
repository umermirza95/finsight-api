import {checkSchema} from "express-validator";
import {FSTransactionMode, FSTransactionType} from "../interface/FSTransaction";
import ERROR_MESSAGES from "../utils/error-messages";
import {categoryIdValidator, subcategoryIdValidator} from "./category-validator";

export const createTransactionValidator = checkSchema({
  type: {
    isIn: {
      options: [[FSTransactionType.expense, FSTransactionType.income]],
      errorMessage: ERROR_MESSAGES["invalid_transaction_type"],
    },
  },
  mode: {
    optional: true,
    isIn: {
      options: [[
        FSTransactionMode.card,
        FSTransactionMode.cash,
        FSTransactionMode.online,
        FSTransactionMode.transfer,
      ]],
      errorMessage: ERROR_MESSAGES["invalid_mode_type"],
    },
  },
  amount: {
    isNumeric: {
      bail: true,
      errorMessage: "Amount is either missing or not a number",
    },
    toFloat: true,
  },
  categoryId: {
    exists: {
      bail: true,
      errorMessage: ERROR_MESSAGES["category_id_missing"],
    },
    custom: {
      options: categoryIdValidator,
    },
  },
  subCategoryId: {
    optional: true,
    custom: {
      options: subcategoryIdValidator,
    },
  },
  date: {
    isISO8601: {
      bail: true,
      errorMessage: "Date is either missing or not valid",
    },
    toDate: true,
  },
})
