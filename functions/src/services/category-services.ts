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

export async function getSubCategoryByName(name: string, uid: string): Promise<FSSubCategory | null> {
  const snapshot = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(uid)
    .collection(CONSTANTS.COLLECTIONS.SUBCATEGORIES)
    .where("name", "==", name)
    .get();
  if (snapshot.empty || !snapshot.docs.length) {
    return null;
  }
  return snapshot.docs[0].data() as FSSubCategory;
}

export async function getAllCategories(userId: string): Promise<FSCategory[]> {
  let snapshot = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.CATEGORIES)
    .get()
  if (snapshot.empty) {
    return []
  }
  const categories = snapshot.docs.map((doc) => doc.data() as FSCategory);
  snapshot = await firestore()
    .collection(CONSTANTS.COLLECTIONS.USERS)
    .doc(userId)
    .collection(CONSTANTS.COLLECTIONS.SUBCATEGORIES)
    .get()
  if (snapshot.empty) {
    return categories;
  }
  snapshot.docs.map((doc) => {
    const subCategory = doc.data() as FSSubCategory;
    const category = categories.find((c)=> c.id === subCategory.categoryId)
    if (category) {
      if (!category.subCategories) {
        category.subCategories=[]
      }
      category.subCategories.push(subCategory)
    }
  })
  return categories;
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
