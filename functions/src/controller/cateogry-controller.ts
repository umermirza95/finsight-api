import {Request, Response} from "express";
import {matchedData} from "express-validator";
import FSCategory from "../interface/FSCategory";
import {v4 as uuidv4} from "uuid";
import {firestore} from "firebase-admin";
import {DecodedIdToken} from "firebase-admin/auth";

export async function createCategory(req: Request, res: Response) {
  try {
    const user: DecodedIdToken = req.body.user;
    const newCategory = matchedData(req) as FSCategory;
    newCategory.id = uuidv4();
    await firestore().collection("users").doc(user.uid).collection("categories").add(newCategory)
    res.status(200).send()
  } catch (error) {
    res.status(200).send("NOT OK")
  }
}
