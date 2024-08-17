import {firestore} from "firebase-admin";
import FSCategory from "../interface/FSCategory";
import CONSTANTS from "../utils/constants";
import FSSubCategory from "../interface/FSSubCategory";

export async function getCategoryByName(name: string, uid: string): Promise<FSCategory | null> {
  const snapshot = await firestore().collection("users").doc(uid).collection("categories").where("name", "==", name).get();
  if (snapshot.empty || !snapshot.docs.length) {
    return null;
  }
  return snapshot.docs[0].data() as FSCategory;
}

export async function getAllCategories(userId: string): Promise<FSCategory[]> {
  const snapshot = await firestore().collection(CONSTANTS.COLLECTIONS.USERS).doc(userId).collection(CONSTANTS.COLLECTIONS.CATEGORIES).get()
  if (snapshot.empty) {
    return []
  }
  return snapshot.docs.map((doc) => doc.data() as FSCategory);
}

export async function getCategoryById(categoryId: string, userId: string): Promise<FSCategory | null> {
  const snapshot = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId).collection(CONSTANTS.COLLECTIONS.CATEGORIES)
    .where("id", "==", categoryId)
    .get();
  if (snapshot.empty || !snapshot.docs.length) {
    return null;
  }
  return snapshot.docs[0].data() as FSCategory;
}

export async function getSubCategoryById(subcategoryId: string, userId: string): Promise<FSSubCategory | null> {
  const snapshot = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId).collection(CONSTANTS.COLLECTIONS.SUBCATEGORIES)
    .where("id", "==", subcategoryId)
    .get();
  if (snapshot.empty || !snapshot.docs.length) {
    return null;
  }
  return snapshot.docs[0].data() as FSSubCategory;
}
