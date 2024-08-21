import {firestore} from "firebase-admin";
import FSTransaction, {FSSupportedCurrencies} from "../interface/FSTransaction";
import CONSTANTS from "../utils/constants";
import ERROR_MESSAGES from "../utils/error-messages";
import {v4 as uuidv4} from "uuid";


export async function addNewTransaction(transaction: FSTransaction, userId: string) {
  transaction.id = uuidv4();
  transaction.updatedAt = new Date();
  transaction.baseAmount = transaction.amount;
  transaction = applyProcessingFee(transaction);
  transaction = await normalizeCurrency(transaction)
  await firestore().collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .doc(transaction.id)
    .create(transaction)
}

export async function getTransactionsInRange(userId: string, from: Date, to: Date): Promise<FSTransaction[]> {
  const snapshop = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .where("date", ">=", from)
    .where("date", "<", to)
    .get()

  return snapshop.empty ? [] : snapshop.docs.map((d)=> {
    const transaction = d.data() as FSTransaction;
    transaction.date = new Date(d.data().date._seconds * 1000);
    return transaction
  });
}

export function applyProcessingFee(transaction: FSTransaction): FSTransaction {
  if (!transaction.processingFeePercent) {
    return transaction;
  }
  const fee = parseFloat((transaction.baseAmount * (transaction.processingFeePercent / 100)).toFixed(2));
  transaction.amount = parseFloat((transaction.baseAmount + fee).toFixed(2));
  return transaction;
}

export async function normalizeCurrency(transaction: FSTransaction): Promise<FSTransaction> {
  if (!transaction.currency || transaction.currency === FSSupportedCurrencies.USD) {
    return transaction;
  }
  const url = `${CONSTANTS.WISE_API_URL}/rates?source=PKR&target=USD&time=${transaction.date.toISOString()}`;
  const req = await fetch(url, {
    headers: {Authorization: "Bearer " + process.env.WISE_API_KEY},
  });
  const res = await req.text();
  if (req.status >= 400) {
    throw Error(res);
  }
  const exchangeRate = JSON.parse(res)[0]?.rate as number;
  if (isNaN(exchangeRate)) {
    throw Error(ERROR_MESSAGES["exchange_rate_failed"])
  }
  transaction.amount = parseFloat((transaction.baseAmount * exchangeRate).toFixed(2));
  return transaction;
}
