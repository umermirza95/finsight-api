import {Request, Response} from "express";
import {logger} from "firebase-functions/v1";
import {errorResponse, successResponse} from "../utils/helpers";
import {matchedData} from "express-validator";
import {DecodedIdToken} from "firebase-admin/auth";
import {addNewTransaction, deleteTransactionById, getTransactionById, getTransactionsInRange} from "../services/transaction-services";
import ICreateTransactionCommand from "../commands/createTransactionCommand";

export async function createTransaction(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const command = matchedData(req) as ICreateTransactionCommand;
    const newTransaction = await addNewTransaction(command, user.uid);
    res.status(200).send(successResponse(newTransaction, "transaction"))
  } catch (error) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const urlParams = matchedData(req)
    await deleteTransactionById(user.uid, urlParams.id);
    res.status(200).send()
  } catch (error) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}

export async function getTransaction(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const urlParams = matchedData(req)
    const transaction = await getTransactionById(user.uid, urlParams.id);
    res.status(200).send(successResponse(transaction, "transaction"));
  } catch (error) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}

export async function getAllTransactions(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const filters = matchedData(req);
    const transactions = await getTransactionsInRange(user.uid, filters.from as Date, filters.to as Date, filters.categoryId);
    res.status(200).send(successResponse(transactions, "transactions"))
  } catch (error) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}

