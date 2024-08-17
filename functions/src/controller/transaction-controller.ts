import {Request, Response} from "express";
import {logger} from "firebase-functions/v1";
import {errorResponse, successResponse} from "../utils/helpers";
import {matchedData} from "express-validator";
import FSTransaction from "../interface/FSTransaction";
import {DecodedIdToken} from "firebase-admin/auth";
import {v4 as uuidv4} from "uuid";
import {addNewTransaction, applyProcessingFee, normalizeCurrency} from "../services/transaction-services";

export async function createTransaction(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    let newTransaction = matchedData(req) as FSTransaction;
    newTransaction.id = uuidv4();
    newTransaction.updatedAt = new Date();
    newTransaction.baseAmount = newTransaction.amount;
    newTransaction = applyProcessingFee(newTransaction);
    newTransaction = await normalizeCurrency(newTransaction)
    await addNewTransaction(newTransaction, user.uid);
    res.status(200).send(successResponse(newTransaction, "transaction"))
  } catch (error) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}
