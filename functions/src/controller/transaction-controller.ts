import {Request, Response} from "express";
import {logger} from "firebase-functions/v1";
import {errorResponse, successResponse} from "../utils/helpers";
import {matchedData} from "express-validator";
import FSTransaction, {FSTransactionType} from "../interface/FSTransaction";
import {DecodedIdToken} from "firebase-admin/auth";
import {addNewTransaction} from "../services/transaction-services";
import {readObjectsFromCsv} from "../services/csv-servicers";
import {getAllCategories} from "../services/category-services";
import FSSubCategory from "../interface/FSSubCategory";
import FSCategory from "../interface/FSCategory";
import {createTransactionValidator} from "../validators/transaction-validator";

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
    let objects = await readObjectsFromCsv("january.csv");
    objects = objects.filter((object) => object.type.toLowerCase() === "expense")
    const categories = await getAllCategories(req.body.user.uid)
    const newTransactions: FSTransaction[] = [];
    for (const object of objects) {
      const amount = object.amount.includes("-") ? parseInt(object.amount) * -1 : parseInt(object.amount)
      const category: FSCategory | undefined = categories.find((c) => c.name === object.category.toLowerCase());
      const subCategory: FSSubCategory | undefined = category?.subCategories?.find((sc) => sc.name === object.subCategory)
      req.body.type = FSTransactionType.expense
      req.body.amount = amount
      req.body.categoryId = category?.id
      req.body.date = object.date
      req.body.subCategoryId = subCategory?.id
      for (const validation of createTransactionValidator) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
          return res.status(400).send("Invalid transaction found "+JSON.stringify(object))
        }
      }
      const newTransaction = matchedData(req) as FSTransaction;
      newTransactions.push(newTransaction)
    }
    logger.info(newTransactions.length + " new transactions found")
    return res.status(200).send("ok")
  } catch (error) {
    logger.error(error);
    return res.status(400).send(errorResponse(error))
  }
}

