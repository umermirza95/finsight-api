import ICreateTransactionCommand from "../commands/createTransactionCommand";
import FSTransaction, {FSSupportedCurrencies} from "../interface/FSTransaction";
import ERROR_MESSAGES from "./error-messages";
import {v4 as uuidv4} from "uuid";

export function errorResponse(error: any) {
  let errorMessage = ERROR_MESSAGES[error.code];
  if (!errorMessage) {
    errorMessage = error.messages;
  }
  if (!errorMessage) {
    errorMessage = "Something went wrong, please check logs for details"
  }
  return {
    data: null,
    errors: [errorMessage],
  }
}

export function successResponse(data: any, resourceName: string) {
  const object: any = {};
  object[resourceName] = data
  return {
    data: object,
    errors: [],
  }
}

export function createTransactionFromCommand(command: ICreateTransactionCommand): FSTransaction {
  const processingFeePercent = command.addProcessingFee ? 1.45 : 0;
  const baseAmount = command.amount;
  const transaction: FSTransaction = {
    id: uuidv4(),
    amount: command.amount,
    baseAmount,
    processingFeePercent: command.addProcessingFee ? processingFeePercent : 0,
    categoryId: command.categoryId,
    subCategoryId: command.subCategoryId ?? "",
    currency: command.currency ?? FSSupportedCurrencies.USD,
    comment: command.comment ?? "",
    date: command.date,
    updatedAt: new Date(),
    type: command.type,
    mode: command.mode,
  };
  if (command.subType) {
    transaction.subType = command.subType;
  }
  return transaction
}
