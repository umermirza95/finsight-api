import {firestore} from "firebase-admin";
import FSTransaction from "../interface/FSTransaction";
import CONSTANTS from "../utils/constants";

export async function addNewTransaction(transaction: FSTransaction, userId:string) {
  await firestore().collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.TRANSACTIONS)
    .doc(transaction.id)
    .create(transaction)
}
