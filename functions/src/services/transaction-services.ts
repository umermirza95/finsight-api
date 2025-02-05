import {firestore} from "firebase-admin";
import FSTransaction, {FSSupportedCurrencies} from "../interface/FSTransaction";
import CONSTANTS from "../utils/constants";
import getCurrencyConverter from "./currency-converter-service";
import ICreateTransactionCommand from "../commands/createTransactionCommand";
import {createTransactionFromCommand} from "../utils/helpers";


export async function addNewTransaction(command: ICreateTransactionCommand, userId: string) : Promise<FSTransaction> {
  let transaction: FSTransaction = createTransactionFromCommand(command);
  transaction = applyProcessingFee(transaction);
  transaction = await normalizeCurrency(transaction, command.useLiveFx ?? false)
  await firestore().collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .doc(transaction.id)
    .create(transaction)
  return transaction;
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
