import {Request, Response} from "express";
import {matchedData} from "express-validator";
import FSCategory from "../interface/FSCategory";
import {v4 as uuidv4} from "uuid";
import {firestore} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";
import {getAllCategories} from "../services/category-services";
import {errorResponse, successResponse} from "../utils/helpers";
import {logger} from "firebase-functions/v1";
import FSSubCategory from "../interface/FSSubCategory";
import CONSTANTS from "../utils/constants";

export async function createCategory(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const newCategory = matchedData(req) as FSCategory;
    newCategory.id = uuidv4();
    await firestore().collection("users").doc(user.uid).collection("categories").doc(newCategory.id).create(newCategory);
    res.status(200).send(successResponse(newCategory, "category"))
  } catch (error: any) {
    res.status(400).send(errorResponse(error))
  }
}

export async function createSubCategory(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const newCategory = matchedData(req) as FSSubCategory;
    newCategory.id = uuidv4();
    await firestore()
      .collection(CONSTANTS.COLLECTIONS.USERS)
      .doc(user.uid)
      .collection(CONSTANTS.COLLECTIONS.SUBCATEGORIES)
      .doc(newCategory.id)
      .create(newCategory);
    res.status(200).send(successResponse(newCategory, "subCategory"))
  } catch (error: any) {
    res.status(400).send(errorResponse(error))
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await getAllCategories(req.body.user.uid)
    res.status(200).send(successResponse(categories, "categories"))
  } catch (error: any) {
    logger.error(error);
    res.status(400).send(errorResponse(error))
  }
}
