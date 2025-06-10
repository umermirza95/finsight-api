import {firestore} from "firebase-admin";
import FSTransaction, {FSSupportedCurrencies} from "../interface/FSTransaction";
import CONSTANTS from "../utils/constants";
import getCurrencyConverter from "./currency-converter-service";
import ICreateTransactionCommand from "../commands/createTransactionCommand";
import {v4 as uuidv4} from "uuid";


export async function addNewTransaction(command: ICreateTransactionCommand, userId: string): Promise<FSTransaction> {
  const transaction: FSTransaction = await createTransactionFromCommand(command);
  return await saveTransaction(userId, transaction);
}

export async function deleteTransactionById(userId: string, id: string) {
  await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .doc(id)
    .delete();
}

export async function getTransactionById(userId: string, id: string): Promise<FSTransaction | null> {
  const snapshop = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .where("id", "==", id)
    .get()
  if (snapshop.empty) {
    return null
  }
  const transaction = snapshop.docs[0].data() as FSTransaction;
  transaction.date = new Date(snapshop.docs[0].data().date._seconds * 1000);
  return transaction;
}

export async function getTransactionsInRange(userId: string, from: Date, to: Date): Promise<FSTransaction[]> {
  const snapshop = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .where("date", ">=", from)
    .where("date", "<", to)
    .orderBy("date", "desc")
    .get()

  return snapshop.empty ? [] : snapshop.docs.map((d) => {
    const transaction = d.data() as FSTransaction;
    transaction.date = new Date(d.data().date._seconds * 1000);
    return transaction
  });
}

function applyProcessingFee(transaction: FSTransaction): FSTransaction {
  if (!transaction.processingFeePercent) {
    return transaction;
  }
  const fee = parseFloat((transaction.baseAmount * (transaction.processingFeePercent / 100)).toFixed(2));
  transaction.amount = parseFloat((transaction.baseAmount + fee).toFixed(2));
  return transaction;
}

async function normalizeCurrency(transaction: FSTransaction, live: boolean): Promise<FSTransaction> {
  if (!transaction.currency || transaction.currency === FSSupportedCurrencies.USD) {
    return transaction;
  }
  transaction.amount = await getCurrencyConverter(live).convert(transaction.baseAmount, transaction.currency, transaction.date);
  return transaction;
}

function createCommentNgram(transaction: FSTransaction): FSTransaction {
  const words = transaction.comment?.split(" ");
  if (!words || !words.length) {
    return transaction
  }
  const ngram: string[] = [];
  words.forEach((word) => {
    let rightIndex = word.length - 1;
    while (rightIndex >= 0) {
      let entry = "";
      for (let i = 0; i <= rightIndex; i++) {
        entry += word[i].toString();
      }
      ngram.push(entry);
      rightIndex--;
    }
  });
  if (ngram.length > 0) {
    transaction.ngram = ngram;
  }
  return transaction;
}

async function createTransactionFromCommand(command: ICreateTransactionCommand): Promise<FSTransaction> {
  const processingFeePercent = command.addProcessingFee ? 1.45 : 0;
  const baseAmount = command.amount;
  let transaction: FSTransaction = {
    id: command.id ?? uuidv4(),
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
  transaction = applyProcessingFee(transaction);
  transaction = await normalizeCurrency(transaction, command.useLiveFx ?? false)
  transaction = createCommentNgram(transaction);
  return transaction
}

async function saveTransaction(userId: string, transaction: FSTransaction) {
  await firestore().collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .doc(transaction.id)
    .create(transaction)
  return transaction
}
