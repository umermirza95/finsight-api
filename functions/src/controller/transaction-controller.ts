import {Request, Response} from "express";
import {logger} from "firebase-functions/v1";
import {errorResponse, successResponse} from "../utils/helpers";
import {matchedData} from "express-validator";
import FSTransaction from "../interface/FSTransaction";
import {DecodedIdToken} from "firebase-admin/auth";
import {addNewTransaction} from "../services/transaction-services";
import {readObjectsFromCsv} from "../services/csv-servicers";

export async function createTransaction(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const newTransaction = matchedData(req) as FSTransaction;
    await addNewTransaction(newTransaction, user.uid);
    res.status(200).send(successResponse(newTransaction, "transaction"))
  } catch (error) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}

export async function importFromCsv(req: Request, res: Response) {
  try {
		 await readObjectsFromCsv("january.csv");
  } catch (error) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}
