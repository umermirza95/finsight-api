import {checkSchema, Meta} from "express-validator";
import {FSTransactionMode, FSTransactionSubType, FSTransactionType, supportedCurrencies} from "../interface/FSTransaction";
import ERROR_MESSAGES from "../utils/error-messages";
import {categoryIdValidatorWithType, subcategoryIdValidator} from "./category-validator";
import {getTransactionById} from "../services/transaction-services";


export const deleteTransactionValidator = checkSchema({
  id: {
    in: "params",
    exists: {
      bail: true,
      errorMessage: "transaction id is required",
    },
    custom: {
      options: transactionIdValidator,
    },
  },
})

export const getTransactionsValidator = checkSchema({
  from: {
    in: "query",
    exists: {
      bail: true,
      errorMessage: "from date is required",
    },
    customSanitizer: {
      options: (value) => {
        const decodedValue = decodeURIComponent(value);
        if (isNaN(Date.parse(decodedValue))) {
          throw new Error("Invalid date format");
        }
        return new Date(decodedValue);
      },
    },
  },
  to: {
    in: "query",
    exists: {
      bail: true,
      errorMessage: "to date is required",
    },
    customSanitizer: {
      options: (value) => {
        const decodedValue = decodeURIComponent(value);
        if (isNaN(Date.parse(decodedValue))) {
          throw new Error("Invalid date format");
        }
        return new Date(decodedValue);
      },
    },
  },
  category: {
    in: "query",
    optional: true,
  },
})

export const createTransactionValidator = checkSchema({
  id: {
    optional: true,
    isString: true,
    custom: {
      bail: true,
      options: transactionIdValidator,
      errorMessage: "Transaction Id is invalid",
    },
  },
  type: {
    isIn: {
      options: [[FSTransactionType.expense, FSTransactionType.income]],
      errorMessage: ERROR_MESSAGES["invalid_transaction_type"],
    },
  },
  subType: {
    optional: true,
    isIn: {
      options: [[FSTransactionSubType.active, FSTransactionSubType.passive]],
      errorMessage: "Invalid transaction sub type",
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
      options: categoryIdValidatorWithType,
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
  processingFeePercent: {
    optional: true,
    toBoolean: true,
  },
  currency: {
    optional: true,
    isIn: {
      options: [supportedCurrencies],
      errorMessage: "Transaction currency is not supported",
    },
    escape: true,
  },
  comment: {
    optional: true,
  },
  useLiveFx: {
    optional: true,
    toBoolean: true,
  },
})

export async function transactionIdValidator(value: string, meta: Meta) {
  try {
    const transaction = await getTransactionById(meta.req.body.user.uid, value)
    if (!transaction) {
      throw Error(ERROR_MESSAGES["invalid_transaction_id"])
    }
  } catch (error: any) {
    throw Error(error)
  }
}
